package com.autoorder.catalog.domain;

import java.util.regex.Pattern;

public record Sku(String value) {

    private static final Pattern VALID_FORMAT = Pattern.compile("^[A-Z0-9-]+$");
    private static final int MAX_LENGTH = 50;

    public Sku {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("SKU não pode ser nulo ou vazio");
        }
        if (value.length() > MAX_LENGTH) {
            throw new IllegalArgumentException(
                "SKU não pode ter mais de %d caracteres".formatted(MAX_LENGTH)
            );
        }
        if (!VALID_FORMAT.matcher(value).matches()) {
            throw new IllegalArgumentException(
                "SKU inválido: '%s'. Apenas letras maiúsculas, números e hífens são permitidos".formatted(value)
            );
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
