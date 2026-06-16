package com.autoorder.translation.messaging;

import com.autoorder.shared.config.RabbitMQConfig;
import com.autoorder.shared.events.RawMessageReceivedEvent;
import com.autoorder.translation.application.TranslationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RawMessageConsumer {

    private static final String TRACE_ID_HEADER = "X-Trace-Id";

    private final TranslationService translationService;

    @RabbitListener(queues = RabbitMQConfig.TRANSLATION_QUEUE)
    public void consume(
            RawMessageReceivedEvent event,
            @Header(value = TRACE_ID_HEADER, required = false) String traceId
    ) {
        // Restaura o Trace ID no MDC para que todos os logs
        // desta thread carreguem o mesmo identificador de rastreamento
        if (traceId != null) {
            MDC.put("traceId", traceId);
        }

        try {
            log.info("Message consumed from queue. messageId={}", event.messageId());
            translationService.translate(event);
        } finally {
            // Limpa o MDC ao final para evitar vazamento entre threads do pool
            MDC.clear();
        }
    }
}