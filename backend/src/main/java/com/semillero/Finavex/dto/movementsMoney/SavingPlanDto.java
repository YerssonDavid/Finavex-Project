package com.semillero.Finavex.dto.movementsMoney;

import java.math.BigDecimal;

public record SavingPlanDto (
        Long id,
        String nameSavingsPlan,
        BigDecimal amountMetaPlan,
        String descriptionPlanSavings
){
}
