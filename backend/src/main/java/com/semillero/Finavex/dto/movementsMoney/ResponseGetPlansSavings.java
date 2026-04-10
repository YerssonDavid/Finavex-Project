package com.semillero.Finavex.dto.movementsMoney;


import java.util.List;

public record ResponseGetPlansSavings(
        List<SavingPlanDto> savingsPlansList
) {
}
