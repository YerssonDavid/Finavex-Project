package com.semillero.Finavex.dto.movementsMoney;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RequestGetMoneyNow(
        @NotBlank(message = "El email es requerido!")
        @Email
        String email
) {
}
