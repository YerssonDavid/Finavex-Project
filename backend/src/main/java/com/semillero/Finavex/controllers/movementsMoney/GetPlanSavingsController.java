package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetPlansSavings;
import com.semillero.Finavex.services.movementsS.GetPlanSavings;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/get/plan-savings")
@RequiredArgsConstructor
public class GetPlanSavingsController {

    private final GetPlanSavings getPlanSavings;

    @GetMapping
    public ResponseEntity<ResponseGetPlansSavings> getPlansSavings (){
        ResponseGetPlansSavings response = getPlanSavings.getPlanSavings();
        return ResponseEntity.ok(response);
    }
}
