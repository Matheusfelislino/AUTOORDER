CREATE TABLE schema_catalog.product_aliases (
    id         UUID         NOT NULL DEFAULT gen_random_uuid(),
    sku        VARCHAR(50)  NOT NULL,
    alias      VARCHAR(255) NOT NULL,

    CONSTRAINT pk_product_aliases PRIMARY KEY (id),
    CONSTRAINT fk_alias_sku FOREIGN KEY (sku)
        REFERENCES schema_catalog.products(sku),
    CONSTRAINT uq_alias UNIQUE (alias)
);

CREATE INDEX idx_product_aliases_alias ON schema_catalog.product_aliases (alias);

INSERT INTO schema_catalog.product_aliases (sku, alias) VALUES
    ('AGU-GAS-CX',  'água com gás'),
    ('AGU-GAS-CX',  'agua com gas'),
    ('AGU-GAS-CX',  'agua gás'),
    ('AGU-SEM-CX',  'água sem gás'),
    ('AGU-SEM-CX',  'agua sem gas'),
    ('AGU-SEM-CX',  'água natural'),
    ('CRV-350-LTA', 'latão'),
    ('CRV-350-LTA', 'cerveja lata'),
    ('CRV-350-LTA', 'cerveja latão'),
    ('CRV-350-LTA', 'latinha'),
    ('REF-LT-FD',   'refri lata'),
    ('REF-LT-FD',   'refrigerante lata'),
    ('REF-LT-FD',   'refrigerante'),
    ('SUC-LRJ-CX',  'suco laranja'),
    ('SUC-LRJ-CX',  'suco de laranja');