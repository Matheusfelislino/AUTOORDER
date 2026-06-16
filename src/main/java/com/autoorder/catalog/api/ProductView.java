package com.autoorder.catalog.api;

import java.math.BigDecimal;

public record ProductView(
        String sku,
        String officialName,
        BigDecimal basePrice,
        int availableStock
) {}