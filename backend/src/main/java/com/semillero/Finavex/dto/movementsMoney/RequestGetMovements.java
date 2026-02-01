package com.semillero.Finavex.dto.movementsMoney;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RequestGetMovements (
        @NotBlank(message = "El email no puede estar vacio")
        @Email
        String email,
        String token
)
{

}