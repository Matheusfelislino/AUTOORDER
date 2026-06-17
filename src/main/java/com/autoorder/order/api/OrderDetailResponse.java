package com.autoorder.order.api;

import com.autoorder.order.domain.Order;
import com.autoorder.order.domain.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderDetailResponse(
        UUID id,
        String messageId,
        String customerId,
        OrderStatus status,
        BigDecimal confirmedTotal,
        long pendingItemsCount,
        Instant createdAt,
        Instant approvedAt,
        Long version,
        String rawContent,
        List<OrderItemResponse> items
) {
    public static OrderDetailResponse from(Order order, String rawContent) {
        return new OrderDetailResponse(
                order.getId(),
                order.getMessageId(),
                order.getCustomerId(),
                order.getStatus(),
                order.getConfirmedTotal().amount(),
                order.getPendingItemsCount(),
                order.getCreatedAt(),
                order.getApprovedAt(),
                order.getVersion(),
                rawContent,
                order.getItems().stream()
                        .map(OrderItemResponse::from)
                        .toList()
        );
    }
}
