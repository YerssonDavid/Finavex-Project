package com.semillero.Finavex.dto.responseMovementsMoney;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public record RequestRegistrySaveMoney(
        Double savedAmount,
        String note,

        @NotBlank(message = "El email no puede estar vacio")
        @Email(message = "El email debe tener un formato valido")
        String email

) {
}

