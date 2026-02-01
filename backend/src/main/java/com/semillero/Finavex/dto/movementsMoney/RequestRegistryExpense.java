package com.semillero.Finavex.dto.movementsMoney;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RequestRegistryExpense(
        @NotNull(message="Debe ingresar un monto")
        BigDecimal expenseAmount,
        String note,
        LocalDate date,

        @NotBlank(message = "El email no puede estar vacio")
        @Email(message = "El email debe tener un formato valido")
        String email
){ }
