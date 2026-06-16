package com.autoorder.catalog.api;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface CatalogQueryService {

    Optional<ProductView> findBySku(String sku);

    // Busca em lote — uma única query IN para evitar N+1
    Map<String, ProductView> findAllBySkus(Set<String> skus);
}