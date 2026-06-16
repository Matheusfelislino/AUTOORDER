ALTER TABLE schema_ingestion.raw_messages
    ADD COLUMN sender_id VARCHAR(100) NOT NULL DEFAULT '';

CREATE INDEX idx_raw_messages_sender_id ON schema_ingestion.raw_messages (sender_id);