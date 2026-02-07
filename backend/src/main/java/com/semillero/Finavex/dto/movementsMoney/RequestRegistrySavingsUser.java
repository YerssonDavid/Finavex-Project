package com.semillero.Finavex.dto.movementsMoney;

import java.math.BigDecimal;

public record RequestRegistrySavingsUser(
        BigDecimal amount,
        String nameSavings
) {
}
