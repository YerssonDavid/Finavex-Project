package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseListRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsPlan;
import com.semillero.Finavex.services.movementsS.SavingsPlanRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping()
@ControllerAdvice
@RequiredArgsConstructor
public class RegistrySavingPlanController {
    private final SavingsPlanRegistry savingsPlanRegistry;

    @PostMapping("/registry/saving-plan")
    @Operation(
            summary = "Registry saving plan",
            description = "Registers a new saving plan for the authenticated user.",
            method = "POST",
            tags = {"Savings Plans"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Saving plan details",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RequestRegistrySavingsPlan.class)
                    ),
                    required = true
            ),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Saving plan successfully registered"
                    )
            }
    )
    public ResponseEntity<ResponseRegistrySavingsPlan> registrySavingPlan (@RequestBody RequestRegistrySavingsPlan requestRegistrySavingsPlan){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isEmpty())
                .map(name -> name.toLowerCase().trim());

        ResponseRegistrySavingsPlan response = savingsPlanRegistry.registrySavingPlan(requestRegistrySavingsPlan, DataService.builder().email(email).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/list/registry/saving-plan")
    @Operation(
            summary = "List saving plans",
            description = "Get the list of saving plans for the authenticated user.",
            method = "GET",
            tags = {"Savings Plans"},
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Saving plans retrieved successfully"
                    )
            }
    )
    public ResponseEntity<List<ResponseListRegistrySavingsPlan>> listRegistrySavingPlan (){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isEmpty())
                .map(name -> name.toLowerCase().trim());

        List<ResponseListRegistrySavingsPlan> response = savingsPlanRegistry.listRegistrySavingsPlan(DataService.builder().email(email).build());
        return ResponseEntity.status(200).body(response);
    }
}