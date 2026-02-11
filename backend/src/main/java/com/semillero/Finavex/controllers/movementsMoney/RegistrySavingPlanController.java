package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsPlan;
import com.semillero.Finavex.services.movementsS.SavingsPlanRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/registry/saving-plan")
@RequiredArgsConstructor
public class RegistrySavingPlanController {
    private final SavingsPlanRegistry savingsPlanRegistry;

    @PostMapping
    public ResponseEntity<ResponseRegistrySavingsPlan> registrySavingPlan (@RequestBody RequestRegistrySavingsPlan requestRegistrySavingsPlan){
        ResponseRegistrySavingsPlan response = savingsPlanRegistry.registrySavingPlan(requestRegistrySavingsPlan);
        return ResponseEntity.ok(response);
    }
}
