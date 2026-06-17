package com.autoorder.order.api;

import com.autoorder.order.domain.OrderStatus;
import java.time.Instant;
import java.util.UUID;

public interface OrderSummary {
    UUID getId();
    String getMessageId();
    String getCustomerId();
    OrderStatus getStatus();
    Instant getCreatedAt();
}