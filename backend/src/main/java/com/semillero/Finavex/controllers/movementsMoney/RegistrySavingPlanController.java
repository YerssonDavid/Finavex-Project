package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseListRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsPlan;
import com.semillero.Finavex.services.movementsS.SavingsPlanRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@RequiredArgsConstructor
public class RegistrySavingPlanController {
    private final SavingsPlanRegistry savingsPlanRegistry;

    @PostMapping("/registry/saving-plan")
    public ResponseEntity<ResponseRegistrySavingsPlan> registrySavingPlan (@RequestBody RequestRegistrySavingsPlan requestRegistrySavingsPlan){
        ResponseRegistrySavingsPlan response = savingsPlanRegistry.registrySavingPlan(requestRegistrySavingsPlan);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/list/registry/saving-plan")
    public ResponseEntity<List<ResponseListRegistrySavingsPlan>> listRegistrySavingPlan (){
        List<ResponseListRegistrySavingsPlan> response = savingsPlanRegistry.listRegistrySavingsPlan();
        return ResponseEntity.status(200).body(response);
    }
}
