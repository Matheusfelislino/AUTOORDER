package com.autoorder.order.application;

import com.autoorder.catalog.api.CatalogQueryService;
import com.autoorder.catalog.api.ProductView;
import com.autoorder.ingestion.infrastructure.RawMessageRepository;
import com.autoorder.order.api.OrderDetailResponse;
import com.autoorder.order.domain.Money;
import com.autoorder.order.domain.Order;
import com.autoorder.order.domain.OrderItem;
import com.autoorder.order.infrastructure.OrderRepository;
import com.autoorder.shared.events.OrderTranslatedEvent;
import com.autoorder.translation.domain.TranslatedOrderItem;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CatalogQueryService catalogQueryService;
    private final RawMessageRepository rawMessageRepository;

    @Transactional
    public void createFromEvent(OrderTranslatedEvent event) {
        if (orderRepository.existsByMessageId(event.messageId())) {
            log.warn("Duplicate OrderTranslatedEvent ignored. messageId={}", event.messageId());
            return;
        }

        log.info("Creating order from event. messageId={} items={}",
                event.messageId(), event.items().size());

        Set<String> rawDescriptions = event.items().stream()
                .map(TranslatedOrderItem::rawDescription)
                .collect(Collectors.toSet());

        Map<String, ProductView> resolvedProducts =
                catalogQueryService.resolveAliases(rawDescriptions);

        List<OrderItem> orderItems = buildOrderItems(event.items(), resolvedProducts);
        Order order = Order.create(event.messageId(), event.customerId(), orderItems);

        try {
            orderRepository.save(order);
            log.info("Order persisted. messageId={} orderId={} status={} confirmedTotal={}",
                    event.messageId(), order.getId(), order.getStatus(),
                    order.getConfirmedTotal());
        } catch (DataIntegrityViolationException e) {
            log.warn("Race condition detected on order creation. messageId={} — discarding duplicate.",
                    event.messageId());
        }
    }

    // Busca o content original no schema_ingestion e monta o DTO completo
    @Transactional(readOnly = true)
    public OrderDetailResponse buildDetailResponse(Order order) {
        String rawContent = rawMessageRepository.findByMessageId(order.getMessageId())
                .map(raw -> raw.getPayload())
                .orElse(null);
        return OrderDetailResponse.from(order, rawContent);
    }

    @Transactional
    public Order approve(UUID orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        order.approve();
        return orderRepository.save(order);
    }

    @Transactional
    public Order reject(UUID orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        order.reject();
        return orderRepository.save(order);
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
