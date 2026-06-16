package com.autoorder.translation.domain;

public record TranslatedOrderItem(
        String rawDescription,
        int quantity,
        String unit
) {}
