package com.autoorder.translation.domain;

public record TranslationOrderItem (
    String rawDescription,
    int quantity,
    String unit
    
) {}

