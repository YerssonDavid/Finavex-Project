package com.semillero.Finavex.dto.movementsMoney;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record RequestRegistrySaveMoney(
        BigDecimal savedAmount,
        String note
) {
}

