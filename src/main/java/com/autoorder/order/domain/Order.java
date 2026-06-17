package com.autoorder.order.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(schema = "schema_order", name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "message_id", nullable = false, unique = true, length = 255)
    private String messageId;

    @Column(name = "customer_id", nullable = false, length = 100)
    private String customerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private OrderStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "approved_at")
    private Instant approvedAt;

    // Optimistic Locking — impede que dois faturistas corrompam o mesmo pedido.
    // O Hibernate inclui WHERE id = ? AND version = ? em todo UPDATE automaticamente.
    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id", nullable = false)
    private List<OrderItem> items;

    public static Order create(
            String messageId,
            String customerId,
            List<OrderItem> items
    ) {
        var order = new Order();
        order.messageId = messageId;
        order.customerId = customerId;
        order.items = items;
        order.createdAt = Instant.now();
        order.status = items.stream()
                .allMatch(i -> i.getStatus() == OrderItemStatus.RESOLVED)
                ? OrderStatus.PENDING
                : OrderStatus.PENDING_REVIEW;
        return order;
    }

    @Transient
    public Money getConfirmedTotal() {
        return items.stream()
                .filter(i -> i.getStatus() == OrderItemStatus.RESOLVED)
                .map(OrderItem::calculateSubtotal)
                .reduce(Money.of("0.00"), Money::add);
    }

    @Transient
    public long getPendingItemsCount() {
        return items.stream()
                .filter(i -> i.getStatus() == OrderItemStatus.PENDING_REVIEW)
                .count();
    }

    @Transient
    public boolean isFullyResolved() {
        return getPendingItemsCount() == 0;
    }

    public void approve() {
        if (this.status != OrderStatus.PENDING) {
            throw new IllegalStateException(
                    "Only PENDING orders can be approved. Current status: " + this.status
            );
        }
        this.status = OrderStatus.APPROVED;
        this.approvedAt = Instant.now();
    }

    public void reject() {
        if (this.status == OrderStatus.APPROVED) {
            throw new IllegalStateException("Approved orders cannot be rejected.");
        }
        this.status = OrderStatus.REJECTED;
    }
}
