CREATE TABLE schema_order.orders (
    id           UUID         NOT NULL DEFAULT gen_random_uuid(),
    message_id   VARCHAR(255) NOT NULL,
    customer_id  VARCHAR(100) NOT NULL,
    status       VARCHAR(30)  NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    approved_at  TIMESTAMP,

    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT uq_orders_message_id UNIQUE (message_id)
);

CREATE TABLE schema_order.order_items (
    id              UUID          NOT NULL DEFAULT gen_random_uuid(),
    order_id        UUID          NOT NULL,
    raw_description VARCHAR(500)  NOT NULL,
    sku             VARCHAR(50),
    quantity        INTEGER       NOT NULL,
    unit            VARCHAR(10)   NOT NULL,
    unit_price      NUMERIC(10,2),
    status          VARCHAR(30)   NOT NULL DEFAULT 'PENDING_REVIEW',

    CONSTRAINT pk_order_items PRIMARY KEY (id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
        REFERENCES schema_order.orders(id)
);

CREATE INDEX idx_orders_status ON schema_order.orders (status);
CREATE INDEX idx_orders_message_id ON schema_order.orders (message_id);
CREATE INDEX idx_order_items_order_id ON schema_order.order_items (order_id);
CREATE INDEX idx_order_items_status ON schema_order.order_items (status);