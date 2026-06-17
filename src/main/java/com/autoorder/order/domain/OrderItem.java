package com.autoorder.order.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(schema = "schema_order", name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "raw_description", nullable = false, length = 500)
    private String rawDescription;

    @Column(name = "sku", length = 50)
    private String sku;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "unit", nullable = false, length = 10)
    private String unit;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private Money unitPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private OrderItemStatus status;

    public static OrderItem resolved(
            String rawDescription,
            String sku,
            int quantity,
            String unit,
            Money unitPrice
    ) {
        var item = new OrderItem();
        item.rawDescription = rawDescription;
        item.sku = sku;
        item.quantity = quantity;
        item.unit = unit;
        item.unitPrice = unitPrice;
        item.status = OrderItemStatus.RESOLVED;
        return item;
    }

    public static OrderItem pendingReview(
            String rawDescription,
            int quantity,
            String unit
    ) {
        var item = new OrderItem();
        item.rawDescription = rawDescription;
        item.sku = null;
        item.quantity = quantity;
        item.unit = unit;
        item.unitPrice = null;
        item.status = OrderItemStatus.PENDING_REVIEW;
        return item;
    }

    @Transient
    public Money calculateSubtotal() {
        if (unitPrice == null) return null;
        return unitPrice.multiply(quantity);
    }
}
