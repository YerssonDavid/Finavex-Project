package com.semillero.Finavex.dto.movementsMoney;

public record ResponseRegistryExpense (
        String message,
        boolean success,
        String formattedAmount
){
}
