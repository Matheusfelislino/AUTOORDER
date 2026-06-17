package com.autoorder.catalog.application;

import com.autoorder.catalog.api.CatalogQueryService;
import com.autoorder.catalog.api.ProductView;
import com.autoorder.catalog.domain.Product;
import com.autoorder.catalog.domain.Sku;
import com.autoorder.catalog.infrastructure.ProductAliasRepository;
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
    private final ProductAliasRepository aliasRepository;

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

    @Override
    @Transactional(readOnly = true)
    public Map<String, ProductView> resolveAliases(Set<String> rawDescriptions) {
        Map<String, String> normalizedToOriginal = rawDescriptions.stream()
                .collect(Collectors.toMap(
                        d -> d.trim().toLowerCase(),
                        d -> d,
                        (existing, duplicate) -> existing
                ));

        Set<String> normalizedDescriptions = normalizedToOriginal.keySet();

        Map<String, String> aliasToSku = aliasRepository
                .findByAliasIn(normalizedDescriptions)
                .stream()
                .collect(Collectors.toMap(
                        a -> a.getAlias(),
                        a -> a.getSku()
                ));

        Set<String> foundSkus = Set.copyOf(aliasToSku.values());
        Map<String, ProductView> skuToProduct = findAllBySkus(foundSkus);

        return normalizedToOriginal.entrySet().stream()
                .filter(e -> aliasToSku.containsKey(e.getKey()))
                .collect(Collectors.toMap(
                        e -> e.getValue(),
                        e -> skuToProduct.get(aliasToSku.get(e.getKey()))
                ));
    }

    private ProductView toView(Product product) {
        return new ProductView(
                product.getSku().value(),
                product.getName(),
                product.getBasePrice().amount(),
                product.getStock()
        );
    }
}
