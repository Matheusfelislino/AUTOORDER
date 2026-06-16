package com.autoorder.order.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;

public record Money(BigDecimal amount, Currency currency) {

    // BRL como padrão de negócio decisão explícita, não acidental
    private static final Currency BRL = Currency.getInstance("BRL");
    private static final int SCALE = 2;

    public Money {
        if (amount == null) {
            throw new IllegalArgumentException("Valor monetário não pode ser nulo");
        }
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor monetário não pode ser negativo");
        }
        if (currency == null) {
            throw new IllegalArgumentException("Moeda não pode ser nula");
        }
        // Normaliza a escala na construção para garantir consistência
        amount = amount.setScale(SCALE, RoundingMode.HALF_EVEN);
    }

    public static Money of(BigDecimal amount) {
        return new Money(amount, BRL);
    }

    public static Money of(String amount) {
        return new Money(new BigDecimal(amount), BRL);
    }

    public Money add(Money other) {
        assertSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }

    public Money multiply(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa");
        }
        return new Money(this.amount.multiply(BigDecimal.valueOf(quantity)), this.currency);
    }

    private void assertSameCurrency(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                "Não é possível operar moedas diferentes: %s e %s"
                    .formatted(this.currency, other.currency)
            );
        }
    }

    @Override
    public String toString() {
        return "%s %s".formatted(currency.getCurrencyCode(), amount.toPlainString());
    }
}