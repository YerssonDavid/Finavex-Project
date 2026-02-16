package com.semillero.Finavex.dto.movementsMoney;

import com.semillero.Finavex.entity.movements.SavingsPlan;

import java.math.BigDecimal;
import java.util.List;

public record ResponseGetPlansSavings(
        List<SavingPlanDto> savingsPlansList
) {
}
