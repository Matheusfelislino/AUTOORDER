package com.autoorder.order.infrastructure;

import com.autoorder.order.api.OrderSummary;
import com.autoorder.order.domain.Order;
import com.autoorder.order.domain.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    boolean existsByMessageId(String messageId);

    // Projeção leve — sem carregar itens, evita N+1 na listagem do dashboard
    Page<OrderSummary> findAllProjectedBy(Pageable pageable);

    Page<OrderSummary> findAllProjectedByStatus(OrderStatus status, Pageable pageable);

    // JOIN FETCH — traz pedido e itens em uma única query para o detalhamento
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(UUID id);
}