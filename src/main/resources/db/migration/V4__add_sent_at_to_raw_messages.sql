ALTER TABLE schema_ingestion.raw_messages
    ADD COLUMN sent_at TIMESTAMP NOT NULL DEFAULT NOW();