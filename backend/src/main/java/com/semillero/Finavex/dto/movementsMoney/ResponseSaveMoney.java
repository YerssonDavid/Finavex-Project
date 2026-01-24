package com.semillero.Finavex.dto.movementsMoney;

import lombok.Builder;

@Builder
public record ResponseSaveMoney (
        String message,
        String formattedAmount,
        boolean success
)
{

}
