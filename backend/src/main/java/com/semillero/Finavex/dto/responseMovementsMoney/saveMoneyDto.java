package com.semillero.Finavex.dto.responseMovementsMoney;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class saveMoneyDto {
    private String message;
    private boolean success;
    private String formattedAmount;
}
