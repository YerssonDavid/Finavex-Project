package com.semillero.Finavex.dto.movementsMoney;

public record ResponseRegistrySavingsPlan(
        String message,
        boolean success,
        Long idPlan,
        String namePlan
) {
}
