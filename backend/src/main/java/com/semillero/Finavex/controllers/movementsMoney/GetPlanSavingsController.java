package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetPlansSavings;
import com.semillero.Finavex.services.movementsS.GetPlanSavings;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/get/plan-savings")
@RequiredArgsConstructor
public class GetPlanSavingsController {

    private final GetPlanSavings getPlanSavings;

    @GetMapping
    public ResponseEntity<ResponseGetPlansSavings> getPlansSavings (){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isEmpty())
                .map(name -> name.toLowerCase().trim());

        ResponseGetPlansSavings response = getPlanSavings.getPlanSavings(DataService.builder().email(email).build());
        return ResponseEntity.ok(response);
    }
}
