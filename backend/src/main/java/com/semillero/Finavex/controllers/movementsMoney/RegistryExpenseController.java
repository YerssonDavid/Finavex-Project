package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.RequestRegistryExpense;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistryExpense;
import com.semillero.Finavex.services.movementsS.RegistryExpense;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/expenses/registry")
@RequiredArgsConstructor
public class RegistryExpenseController {
    private final RegistryExpense registryExpense;

    @PostMapping()
    @Operation(
            summary = "Registry expense",
            description = "Registers a new expense for the authenticated user. The user email is automatically extracted from the JWT token.",
            method = "POST",
            tags = {"Registry expense to user"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Expense details: amount and optional note",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = RequestRegistryExpense.class)
                    ),
                    required = true
            ),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Expense registered successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseRegistryExpense.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - Invalid or missing JWT token"
                    )
            }
    )
    public ResponseEntity<ResponseRegistryExpense> registryExpense(@RequestBody @Valid RequestRegistryExpense requestRegistryExpense){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isBlank())
                .map(name -> name.toLowerCase().trim());

        ResponseRegistryExpense response = registryExpense.registryExpense(requestRegistryExpense, DataService.builder().email(email).build());
        return ResponseEntity.ok(response);
    }
}