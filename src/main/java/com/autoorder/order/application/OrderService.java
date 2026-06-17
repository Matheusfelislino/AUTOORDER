package com.autoorder.order.application;

import com.autoorder.catalog.api.CatalogQueryService;
import com.autoorder.catalog.api.ProductView;
import com.autoorder.order.domain.Money;
import com.autoorder.order.domain.Order;
import com.autoorder.order.domain.OrderItem;
import com.autoorder.order.infrastructure.OrderRepository;
import com.autoorder.shared.events.OrderTranslatedEvent;
import com.autoorder.translation.domain.TranslatedOrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CatalogQueryService catalogQueryService;

    @Transactional
    public void createFromEvent(OrderTranslatedEvent event) {
        // Idempotência — early return se já processamos este evento
        if (orderRepository.existsByMessageId(event.messageId())) {
            log.warn("Duplicate OrderTranslatedEvent ignored. messageId={}",
                    event.messageId());
            return;
        }

        log.info("Creating order from event. messageId={} items={}",
                event.messageId(), event.items().size());

        // Resolve aliases em lote — uma única query no Catalog
        Set<String> rawDescriptions = event.items().stream()
                .map(TranslatedOrderItem::rawDescription)
                .collect(Collectors.toSet());

        Map<String, ProductView> resolvedProducts =
                catalogQueryService.resolveAliases(rawDescriptions);

        // Constrói itens — RESOLVED se encontrou alias, PENDING_REVIEW se não encontrou
        List<OrderItem> orderItems = buildOrderItems(event.items(), resolvedProducts);

        Order order = Order.create(event.messageId(), event.customerId(), orderItems);

        try {
            orderRepository.save(order);
            log.info("Order persisted. messageId={} orderId={} status={} confirmedTotal={}",
                    event.messageId(), order.getId(), order.getStatus(),
                    order.getConfirmedTotal());

        } catch (DataIntegrityViolationException e) {
            // Race condition: dois eventos chegaram simultaneamente
            // O banco rejeitou o segundo via UNIQUE CONSTRAINT
            // Descartamos silenciosamente — o primeiro já foi processado
            log.warn("Race condition detected on order creation. messageId={} — discarding duplicate.",
                    event.messageId());
        }
    }

    private List<OrderItem> buildOrderItems(
            List<TranslatedOrderItem> translatedItems,
            Map<String, ProductView> resolvedProducts
    ) {
        List<OrderItem> orderItems = new ArrayList<>();

        for (TranslatedOrderItem translatedItem : translatedItems) {
            ProductView product = resolvedProducts.get(translatedItem.rawDescription());

            if (product != null) {
                orderItems.add(OrderItem.resolved(
                        translatedItem.rawDescription(),
                        product.sku(),
                        translatedItem.quantity(),
                        translatedItem.unit(),
                        Money.of(product.basePrice())
                ));
            } else {
                orderItems.add(OrderItem.pendingReview(
                        translatedItem.rawDescription(),
                        translatedItem.quantity(),
                        translatedItem.unit()
                ));
            }
        }

        return orderItems;
    }
}