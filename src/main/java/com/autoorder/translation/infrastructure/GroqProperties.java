package com.autoorder.translation.infrastructure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "groq")
public record GroqProperties(

        @NotBlank
        String apiUrl,

        @NotBlank
        String apiKey,

        @NotBlank
        String model,

        @Positive
        int connectTimeoutSeconds,

        @Positive
        int readTimeoutSeconds
) {}