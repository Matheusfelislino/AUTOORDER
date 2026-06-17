package com.autoorder.order.api;

import com.autoorder.order.domain.OrderItem;
import com.autoorder.order.domain.OrderItemStatus;
import java.math.BigDecimal;

public record OrderItemResponse(
        String rawDescription,
        String sku,
        int quantity,
        String unit,
        BigDecimal unitPrice,
        BigDecimal subtotal,
        OrderItemStatus status
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getRawDescription(),
                item.getSku(),
                item.getQuantity(),
                item.getUnit(),
                item.getUnitPrice() != null ? item.getUnitPrice().amount() : null,
                item.calculateSubtotal() != null ? item.calculateSubtotal().amount() : null,
                item.getStatus()
        );
    }
}