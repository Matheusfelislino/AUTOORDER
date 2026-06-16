package com.autoorder.ingestion.application;

import com.autoorder.ingestion.api.WebhookRequestDto;
import com.autoorder.ingestion.domain.RawMessage;
import com.autoorder.ingestion.infrastructure.IdempotencyRedisAdapter;
import com.autoorder.ingestion.infrastructure.RawMessageRepository;
import com.autoorder.shared.events.RawMessageReceivedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngestionService {

    private final RawMessageRepository repository;
    private final IdempotencyRedisAdapter idempotencyAdapter;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void ingest(WebhookRequestDto dto) {
        log.info("Webhook received. messageId={} provider={}", dto.messageId(), dto.provider());

        if (!idempotencyAdapter.isFirstOccurrence(dto.messageId())) {
            log.info("Message already processed, skipping. messageId={}", dto.messageId());
            return;
        }

        RawMessage message = RawMessage.create(
                dto.messageId(),
                dto.provider(),
                dto.senderId(),
                dto.content(),
                dto.sentAt()
        );

        repository.save(message);
        log.info("Message persisted. messageId={} id={}", dto.messageId(), message.getId());

        // Evento Spring interno — o RabbitMQ só será acionado após o commit do banco
        eventPublisher.publishEvent(new RawMessageReceivedEvent(
                dto.messageId(),
                dto.provider(),
                dto.senderId(),
                dto.content(),
                dto.sentAt()
        ));
    }
}