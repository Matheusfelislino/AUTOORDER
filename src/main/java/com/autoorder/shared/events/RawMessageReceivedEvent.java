package com.autoorder.shared.events;

import java.time.Instant;

public record RawMessageReceivedEvent(
        String messageId,
        String provider,
        String senderId,
        String content,
        Instant sentAt
) {}