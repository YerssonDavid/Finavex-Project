package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.movementsMoney.limitExpense.RequestRegistryLimitExpense;
import com.semillero.Finavex.services.movementsS.limitExpense.LimitExpenseRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequiredArgsConstructor
@RequestMapping("/registry/limitExpense")
public class LimitExpenseRegistryController {
    private final LimitExpenseRegistry limitExpenseRegistry;

    @PostMapping()
    @Operation(
            summary = "Registry limit expense",
            description = "Registers a new expense limit for the authenticated user. The user email is automatically extracted from the JWT token.",
            method = "POST",
            tags = {"Expense Limits"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Expense limit details",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RequestRegistryLimitExpense.class)
                    ),
                    required = true
            ),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Expense limit successfully registered"
                    )
            }
    )
    public ResponseEntity<ApiResponse> registryLimitExpenseC (@RequestBody RequestRegistryLimitExpense request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName().toLowerCase().trim();
        ApiResponse response = limitExpenseRegistry.registerLimitExpense(request, email);
        return ResponseEntity.ok(response);
    }
}
