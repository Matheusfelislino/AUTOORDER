package com.autoorder.catalog.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(schema = "schema_catalog", name = "product_aliases")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "sku", nullable = false, length = 50)
    private String sku;

    @Column(name = "alias", nullable = false, length = 255)
    private String alias;
}
