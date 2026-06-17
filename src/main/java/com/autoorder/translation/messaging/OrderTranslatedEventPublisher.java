package com.autoorder.translation.messaging;

import com.autoorder.shared.config.RabbitMQConfig;
import com.autoorder.shared.events.OrderTranslatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderTranslatedEventPublisher {

    private static final String TRACE_ID_HEADER = "X-Trace-Id";

    private final RabbitTemplate rabbitTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(OrderTranslatedEvent event) {
        try {
            String traceId = MDC.get("traceId");

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EVENTS_EXCHANGE,
                    RabbitMQConfig.ROUTING_KEY_ORDER_TRANSLATED,
                    event,
                    message -> {
                        MessageProperties props = message.getMessageProperties();
                        if (traceId != null) {
                            props.setHeader(TRACE_ID_HEADER, traceId);
                        }
                        return message;
                    }
            );

            log.info("OrderTranslatedEvent published. messageId={}", event.messageId());

        } catch (Exception e) {
            log.error("CRITICAL: Failed to publish OrderTranslatedEvent. messageId={} error={}",
                    event.messageId(), e.getMessage(), e);
        }
    }
}