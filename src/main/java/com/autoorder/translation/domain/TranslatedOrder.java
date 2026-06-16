package com.autoorder.translation.domain;

import java.util.List;

public record TranslatedOrder(
        String customerId,
        List<TranslatedOrderItem> items,
        String observation
) {
    // Validação defensiva — a IA pode retornar lista nula ou vazia
    public boolean isValid() {
        return customerId != null
                && !customerId.isBlank()
                && items != null
                && !items.isEmpty()
                && items.stream().allMatch(i -> i.quantity() > 0);
    }
}