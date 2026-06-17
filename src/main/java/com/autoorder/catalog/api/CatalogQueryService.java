package com.autoorder.catalog.api;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface CatalogQueryService {

    Optional<ProductView> findBySku(String sku);

    // Busca em lote por SKU — evita N+1
    Map<String, ProductView> findAllBySkus(Set<String> skus);

    // Resolve descrições informais para SKUs via tabela de aliases
    // Retorna apenas os que foram encontrados — ausentes = PENDING_REVIEW
    Map<String, ProductView> resolveAliases(Set<String> rawDescriptions);
}