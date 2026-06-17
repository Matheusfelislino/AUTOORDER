package com.autoorder.order.domain;

public enum OrderStatus {
    PENDING,         // todos os itens resolvidos — aguarda aprovação
    PENDING_REVIEW,  // um ou mais itens sem SKU — requer revisão do faturista
    APPROVED,        // faturista aprovou — pronto para ERP
    REJECTED         // faturista rejeitou
}