package com.autoorder.order.domain;

public enum OrderItemStatus {
    RESOLVED,       // SKU encontrado via alias — preço aplicado
    PENDING_REVIEW  // alias não encontrado — faturista precisa mapear
}