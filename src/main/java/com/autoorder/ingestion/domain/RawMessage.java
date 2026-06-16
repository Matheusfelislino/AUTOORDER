package com.autoorder.ingestion.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(schema = "schema_ingestion", name = "raw_messages")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RawMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "message_id", nullable = false, unique = true, length = 255)
    private String messageId;

    @Column(name = "provider", nullable = false, length = 50)
    private String provider;

    @Column(name = "sender_id", nullable = false, length = 100)
    private String senderId;

    @Column(name = "payload", nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private MessageStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "sent_at", nullable = false, updatable = false)
    private Instant sentAt;

    @Column(name = "processed_at")
    private Instant processedAt;

    // Flyway criou a tabela — o Hibernate apenas valida.
    // A criação do objeto passa obrigatoriamente por este factory method,
    // garantindo que nenhuma instância incompleta seja persistida.
    public static RawMessage create(
            String messageId,
            String provider,
            String senderId,
            String payload,
            Instant sentAt
    ) {
        var message = new RawMessage();
        message.messageId = messageId;
        message.provider = provider;
        message.senderId = senderId;
        message.payload = payload;
        message.sentAt = sentAt;
        message.status = MessageStatus.RECEIVED;
        message.createdAt = Instant.now();
        return message;
    }

    // Transições de estado explícitas — o domínio controla o ciclo de vida,
    // não código externo atribuindo status livremente via setter.
    public void markAsProcessing() {
        this.status = MessageStatus.PROCESSING;
    }

    public void markAsProcessed() {
        this.status = MessageStatus.PROCESSED;
        this.processedAt = Instant.now();
    }

    public void markAsFailed() {
        this.status = MessageStatus.FAILED;
        this.processedAt = Instant.now();
    }
}
