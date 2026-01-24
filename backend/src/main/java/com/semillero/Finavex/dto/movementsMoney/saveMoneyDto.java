package com.semillero.Finavex.dto.movementsMoney;

public record saveMoneyDto (
        String message,
        boolean success,
        String formattedAmount
) {
}
