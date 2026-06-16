package com.autoorder.ingestion.infrastructure;

import com.autoorder.ingestion.domain.RawMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface RawMessageRepository extends JpaRepository<RawMessage, UUID> {

    boolean existsByMessageId(String messageId);
}