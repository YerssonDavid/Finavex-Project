package com.semillero.Finavex.dto.movementsMoney.limitExpense;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Date;

public record RequestRegistryLimitExpense(
        @NotNull(message="El valor no puede estar vacio")
        @DecimalMin(value="100.00", message="El valor debe ser mayor a $100.00")
        BigDecimal valueLimit,

        @NotNull(message="Se debe de establecer una fecha de expiracion para el limite")
        @Future(message = "La fecha de expiracion debe ser posterior a hoy")
        Date expirationDateRegistry
){
}
