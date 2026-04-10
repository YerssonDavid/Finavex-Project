package com.semillero.Finavex.dto.movementsMoney;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ResponseGetMovements (
        String movementType,
        LocalDateTime date,
        String noteMovement,
        BigDecimal amountMovement
){
}
