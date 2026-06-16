package com.autoorder.ingestion.infrastructure;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class IdempotencyRedisAdapter {

    private static final String KEY_PREFIX = "idempotency:webhook:";
    private static final Duration TTL = Duration.ofHours(24);

    private final StringRedisTemplate redisTemplate;

    // Tenta registrar o messageId. Retorna true se é a primeira vez
    // que esta mensagem aparece na janela de 24h — false se é duplicata.
    public boolean isFirstOccurrence(String messageId) {
        String key = KEY_PREFIX + messageId;
        Boolean inserted = redisTemplate.opsForValue().setIfAbsent(key, "1", TTL);

        if (Boolean.TRUE.equals(inserted)) {
            log.debug("Idempotency key registered: {}", key);
            return true;
        }

        log.warn("Duplicate message detected. messageId={}", messageId);
        return false;
    }
}