package com.autoorder.order.messaging;

import com.autoorder.order.application.OrderService;
import com.autoorder.shared.config.RabbitMQConfig;
import com.autoorder.shared.events.OrderTranslatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TranslatedOrderConsumer {

    private static final String TRACE_ID_HEADER = "X-Trace-Id";

    private final OrderService orderService;

    @RabbitListener(queues = RabbitMQConfig.ORDER_QUEUE)
    public void consume(
            OrderTranslatedEvent event,
            @Header(value = TRACE_ID_HEADER, required = false) String traceId
    ) {
        if (traceId != null) {
            MDC.put("traceId", traceId);
        }

        try {
            log.info("OrderTranslatedEvent consumed. messageId={}", event.messageId());
            orderService.createFromEvent(event);
        } finally {
            MDC.clear();
        }
    }
}