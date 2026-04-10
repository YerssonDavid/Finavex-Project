package com.semillero.Finavex.dto.movementsMoney;


import java.math.BigDecimal;

public record RequestRegistrySaveMoney(
        BigDecimal savedAmount,
        String note
) {
}

