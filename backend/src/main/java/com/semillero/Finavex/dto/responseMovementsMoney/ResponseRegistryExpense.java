package com.semillero.Finavex.dto.responseMovementsMoney;

public record ResponseRegistryExpense (
        String message,
        boolean success,
        String formattedAmount
){
}
