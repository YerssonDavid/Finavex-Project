package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistryExpense;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistryExpense;
import com.semillero.Finavex.services.movementsS.RegistryExpense;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expenses/registry")
@RequiredArgsConstructor
public class RegistryExpenseController {
    private final RegistryExpense registryExpense;

    @PostMapping()
    @Operation(
            summary = "Registry expense",
            description = "Endpoint for registry an expense",
            method = "POST",
            tags = {"Registry expense to user"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "It is expected to email, amount of expense and note",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = String.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<ResponseRegistryExpense> registryExpense(@RequestBody @Valid RequestRegistryExpense requestRegistryExpense){
        ResponseRegistryExpense response = registryExpense.registryExpense(requestRegistryExpense);
        return ResponseEntity.ok().body(response);
    }
}
