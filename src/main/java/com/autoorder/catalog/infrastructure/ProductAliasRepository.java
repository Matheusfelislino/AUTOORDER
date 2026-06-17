package com.autoorder.catalog.infrastructure;

import com.autoorder.catalog.domain.ProductAlias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ProductAliasRepository extends JpaRepository<ProductAlias, UUID> {

    // Busca em lote com normalização — LOWER() no banco para matching case-insensitive
    @Query("SELECT a FROM ProductAlias a WHERE a.alias IN :aliases")
    List<ProductAlias> findByAliasIn(Set<String> aliases);
}