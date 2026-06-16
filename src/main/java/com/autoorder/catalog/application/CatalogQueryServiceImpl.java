package com.autoorder.catalog.application;

import com.autoorder.catalog.api.CatalogQueryService;
import com.autoorder.catalog.api.ProductView;
import com.autoorder.catalog.domain.Product;
import com.autoorder.catalog.domain.Sku;
import com.autoorder.catalog.infrastructure.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CatalogQueryServiceImpl implements CatalogQueryService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductView> findBySku(String sku) {
        return productRepository.findBySku(new Sku(sku))
                .map(this::toView);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, ProductView> findAllBySkus(Set<String> skus) {
        Set<Sku> skuValues = skus.stream()
                .map(Sku::new)
                .collect(Collectors.toSet());

        return productRepository.findBySkuIn(skuValues)
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getSku().value(),
                        this::toView
                ));
    }

    // Converte entidade interna para DTO público —
    // entidade Product nunca vaza para fora do Catalog Context
    private ProductView toView(Product product) {
        return new ProductView(
                product.getSku().value(),
                product.getName(),
                product.getBasePrice().amount(),
                product.getStock()
        );
    }
}