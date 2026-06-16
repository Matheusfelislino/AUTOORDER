package com.autoorder.translation.infrastructure;

import com.autoorder.translation.domain.TranslatedOrder;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class GroqRestClient {

    private final RestClient restClient;
    private final GroqProperties properties;
    private final ObjectMapper objectMapper;

    public GroqRestClient(GroqProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;

        // Timeouts configurados conforme alertado pelo CTO —
        // sem isso, sockets esgotam sob instabilidade da API externa.
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(
                (int) Duration.ofSeconds(properties.connectTimeoutSeconds()).toMillis()
        );
        factory.setReadTimeout(
                (int) Duration.ofSeconds(properties.readTimeoutSeconds()).toMillis()
        );

        this.restClient = RestClient.builder()
                .requestFactory(factory)
                .baseUrl(properties.apiUrl())
                .defaultHeader("Authorization", "Bearer " + properties.apiKey())
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public TranslatedOrder translate(String systemPrompt, String userContent) {
        var requestBody = Map.of(
                "model", properties.model(),
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userContent)
                )
        );

        log.debug("Sending request to Groq. model={}", properties.model());

        String rawResponse = restClient.post()
                .body(requestBody)
                .retrieve()
                .body(String.class);

        return parseResponse(rawResponse);
    }

    private TranslatedOrder parseResponse(String rawResponse) {
        try {
            // Primeiro parse: extrai o envelope da resposta do Groq
            var root = objectMapper.readTree(rawResponse);
            String content = root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            log.debug("Raw LLM content extracted: {}", content);

            // Segundo parse: mapeia o JSON do LLM para o nosso domínio
            return objectMapper.readValue(content, TranslatedOrder.class);

        } catch (Exception e) {
            // Propaga para o RabbitMQ gerenciar via retry e DLQ
            throw new IllegalStateException(
                    "Failed to parse Groq response: " + e.getMessage(), e
            );
        }
    }
}