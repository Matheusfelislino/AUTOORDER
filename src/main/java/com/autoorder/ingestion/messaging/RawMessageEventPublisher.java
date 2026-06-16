package com.autoorder.ingestion.messaging;

import com.autoorder.shared.config.RabbitMQConfig;
import com.autoorder.shared.events.RawMessageReceivedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Slf4j
@Component
@RequiredArgsConstructor
public class RawMessageEventPublisher {

    private static final String TRACE_ID_HEADER = "X-Trace-Id";

    private final RabbitTemplate rabbitTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(RawMessageReceivedEvent event) {
        try {
            String traceId = MDC.get("traceId");

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EVENTS_EXCHANGE,
                    RabbitMQConfig.ROUTING_KEY_MESSAGE_RECEIVED,
                    event,
                    message -> {
                        MessageProperties props = message.getMessageProperties();
                        if (traceId != null) {
                            props.setHeader(TRACE_ID_HEADER, traceId);
                        }
                        return message;
                    }
            );

            log.info("Event published to RabbitMQ. messageId={} traceId={}",
                    event.messageId(), traceId);

        } catch (Exception e) {
            // Dual-Write risk: banco já commitou, RabbitMQ falhou.
            // Log ERROR para disparar alertas em produção — registro ficará em RECEIVED.
            log.error("CRITICAL: Failed to publish event after DB commit. " +
                      "Message stuck in RECEIVED status. messageId={} error={}",
                      event.messageId(), e.getMessage(), e);
        }
    }
}