CREATE TABLE schema_ingestion.raw_messages (
    id                UUID         NOT NULL DEFAULT gen_random_uuid(),
    message_id        VARCHAR(255) NOT NULL,
    provider          VARCHAR(50)  NOT NULL,
    payload           TEXT         NOT NULL,
    status            VARCHAR(30)  NOT NULL DEFAULT 'RECEIVED',
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    processed_at      TIMESTAMP,

    CONSTRAINT pk_raw_messages PRIMARY KEY (id),
    CONSTRAINT uq_raw_messages_message_id UNIQUE (message_id)
);

CREATE INDEX idx_raw_messages_status ON schema_ingestion.raw_messages (status);
CREATE INDEX idx_raw_messages_created_at ON schema_ingestion.raw_messages (created_at);
