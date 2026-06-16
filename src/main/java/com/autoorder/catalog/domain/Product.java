package com.autoorder.catalog.domain;

import com.autoorder.order.domain.Money;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(schema = "schema_catalog", name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // SkuConverter aplicado automaticamente via autoApply = true
    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private Sku sku;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    // MoneyConverter aplicado automaticamente via autoApply = true
    @Column(name = "base_price", nullable = false,
            precision = 10, scale = 2)
    private Money basePrice;

    @Column(name = "stock", nullable = false)
    private int stock;

    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public boolean hasStock(int requestedQuantity) {
        return this.stock >= requestedQuantity;
    }
}