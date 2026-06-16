package com.autoorder.ingestion.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record WebhookRequestDto(

        @NotBlank(message = "messageId é obrigatório")
        String messageId,

        @NotBlank(message = "provider é obrigatório")
        String provider,

        @NotBlank(message = "senderId é obrigatório")
        String senderId,

        @NotBlank(message = "content é obrigatório")
        String content,

        @NotNull(message = "sentAt é obrigatório")
        Instant sentAt
) {}

