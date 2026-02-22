package com.semillero.Finavex.dto.movementsMoney;

import com.semillero.Finavex.entity.movements.SavingsPlan;

import java.util.HashMap;
import java.util.List;

public record ResponseListRegistrySavingsPlan(
        Long id,
        String nameSavingsPlan
) {
}
