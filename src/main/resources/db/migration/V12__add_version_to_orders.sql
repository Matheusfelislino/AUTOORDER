ALTER TABLE schema_order.orders
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;