package com.semillero.Finavex.dto.responseMovementsMoney;

public record saveMoneyDto (
        String message,
        boolean success,
        String formattedAmount
) {
}
