package com.semillero.Finavex.dto.movementsMoney;

import java.math.BigDecimal;

public record RequestRegistrySavingsUser(
        String namePlan,
        BigDecimal amount
) {
}
