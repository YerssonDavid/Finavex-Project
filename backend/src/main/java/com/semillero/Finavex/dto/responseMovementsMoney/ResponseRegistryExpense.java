package com.semillero.Finavex.dto.responseMovementsMoney;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseRegistryExpense {
    private String message;
    private boolean success;
    private String formattedAmount;
}
