package com.semillero.Finavex.dto.movementsMoney;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record RequestRegistrySaveMoney(
        BigDecimal savedAmount,
        String note,

        @NotBlank(message = "El email no puede estar vacio")
        @Email(message = "El email debe tener un formato valido")
        String email

) {
}

