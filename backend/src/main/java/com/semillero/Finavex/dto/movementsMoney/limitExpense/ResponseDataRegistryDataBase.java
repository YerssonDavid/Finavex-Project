package com.semillero.Finavex.dto.movementsMoney.limitExpense;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

public record ResponseDataRegistryDataBase(
        BigDecimal value,
        Date expiration,
        LocalDateTime dateRegistry
) {
}
