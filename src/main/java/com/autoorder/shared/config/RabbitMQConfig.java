package com.autoorder.shared.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange principal — todos os eventos do AutoOrder passam por aqui
    public static final String EVENTS_EXCHANGE = "autoorder.events";

    // Dead Letter Exchange — destino de mensagens que esgotaram retries
    public static final String DLX_EXCHANGE = "autoorder.events.dlx";

    // Routing keys
    public static final String ROUTING_KEY_MESSAGE_RECEIVED = "ingestion.message.received";

    // Filas do Translation Context
    public static final String TRANSLATION_QUEUE = "translation.process.queue";
    public static final String TRANSLATION_DLQ = "translation.process.dlq";

    @Bean
    public TopicExchange eventsExchange() {
        return ExchangeBuilder
                .topicExchange(EVENTS_EXCHANGE)
                .durable(true)
                .build();
    }

    @Bean
    public TopicExchange dlxExchange() {
        return ExchangeBuilder
                .topicExchange(DLX_EXCHANGE)
                .durable(true)
                .build();
    }

    @Bean
    public Queue translationQueue() {
        return QueueBuilder
                .durable(TRANSLATION_QUEUE)
                // Redireciona para DLX quando a mensagem falha
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", TRANSLATION_DLQ)
                .build();
    }

    @Bean
    public Queue translationDlq() {
        return QueueBuilder
                .durable(TRANSLATION_DLQ)
                .build();
    }

    @Bean
    public Binding translationBinding() {
        return BindingBuilder
                .bind(translationQueue())
                .to(eventsExchange())
                .with(ROUTING_KEY_MESSAGE_RECEIVED);
    }

    @Bean
    public Binding translationDlqBinding() {
        return BindingBuilder
                .bind(translationDlq())
                .to(dlxExchange())
                .with(TRANSLATION_DLQ);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper mapper = new ObjectMapper();
        // Necessário para serializar/deserializar Instant corretamente
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return new Jackson2JsonMessageConverter(mapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
