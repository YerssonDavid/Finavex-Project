package com.semillero.Finavex.dto.movementsMoney;

import java.math.BigDecimal;

public record RequestRegistrySavingsPlan (
        String nameSavingsPlan,
        BigDecimal amountMetaPlan,
        String descriptionPlanSavings
){
}
