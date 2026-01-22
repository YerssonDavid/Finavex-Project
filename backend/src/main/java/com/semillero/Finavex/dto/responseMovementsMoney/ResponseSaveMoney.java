package com.semillero.Finavex.dto.responseMovementsMoney;

import lombok.Builder;

@Builder
public record ResponseSaveMoney (
        String message,
        String formattedAmount,
        boolean success
)
{

}
