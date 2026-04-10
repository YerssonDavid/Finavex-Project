package com.semillero.Finavex.dto.movementsMoney;

import java.math.BigDecimal;

public record RequestRegistrySavingsUser(
        Long idPlan,
        BigDecimal amount
) {
}
