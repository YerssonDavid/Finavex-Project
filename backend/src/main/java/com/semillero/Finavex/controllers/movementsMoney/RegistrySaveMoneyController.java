package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySaveMoney;
import com.semillero.Finavex.dto.movementsMoney.ResponseSaveMoney;
import com.semillero.Finavex.services.movementsS.RegisterSaveMoney;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/save-money")
@RequiredArgsConstructor
public class RegistrySaveMoneyController {
    private final RegisterSaveMoney registerSaveMoney;

    @PostMapping()
    @Operation(
            summary = "Save register of money saved by the user",
            description = "Registers income/savings for the authenticated user. The user email is automatically extracted from the JWT token.",
            method = "POST",
            tags = {"Movements money - Income"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Savings details: amount and optional note",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = RequestRegistrySaveMoney.class)
                    ),
                    required = true
            ),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Savings registered successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseSaveMoney.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - Invalid or missing JWT token"
                    )
            }
    )
    public ResponseEntity<ResponseSaveMoney> saveMoney(@RequestBody RequestRegistrySaveMoney requestRegistrySaveMoney) {
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isEmpty())
                .map(name -> name.toLowerCase().trim());

       ResponseSaveMoney result = registerSaveMoney.registerSaveMoney(requestRegistrySaveMoney, DataService.builder().email(email).build());
       return ResponseEntity.ok().body(result);
    }
}
