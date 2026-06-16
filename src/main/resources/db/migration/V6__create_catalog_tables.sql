CREATE TABLE schema_catalog.products (
    id           UUID         NOT NULL DEFAULT gen_random_uuid(),
    sku          VARCHAR(50)  NOT NULL,
    name         VARCHAR(255) NOT NULL,
    base_price   NUMERIC(10,2) NOT NULL,
    stock        INTEGER      NOT NULL DEFAULT 0,
    active       BOOLEAN      NOT NULL DEFAULT true,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT uq_products_sku UNIQUE (sku),
    CONSTRAINT chk_products_stock CHECK (stock >= 0),
    CONSTRAINT chk_products_price CHECK (base_price >= 0)
);

CREATE TABLE schema_catalog.clients (
    id           UUID         NOT NULL DEFAULT gen_random_uuid(),
    sender_id    VARCHAR(100) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    active       BOOLEAN      NOT NULL DEFAULT true,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_clients PRIMARY KEY (id),
    CONSTRAINT uq_clients_sender_id UNIQUE (sender_id)
);

CREATE INDEX idx_products_sku ON schema_catalog.products (sku);
CREATE INDEX idx_clients_sender_id ON schema_catalog.clients (sender_id);