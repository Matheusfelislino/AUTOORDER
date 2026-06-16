package com.autoorder.catalog.infrastructure;

import com.autoorder.catalog.domain.Product;
import com.autoorder.catalog.domain.Sku;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.Set;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySku(Sku sku);

    // Busca em lote — evita N+1 quando o pedido tem múltiplos itens
    List<Product> findBySkuIn(Set<Sku> skus);
}