package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.responseMovementsMoney.RequestRegistrySaveMoney;
import com.semillero.Finavex.dto.responseMovementsMoney.saveMoneyDto;
import com.semillero.Finavex.services.movementsS.RegisterSaveMoney;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/save-money")
@RequiredArgsConstructor
public class saveMoneyController {
    private final RegisterSaveMoney registerSaveMoney;

    @PostMapping()
    @Operation(
            summary = "Save register of money saved by the user",
            description = "Endpoint for register the money saved by the user",
            method = "POST",
            tags = {"Movements money - Income"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Request body to save money",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = String.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<saveMoneyDto> saveMoney(@RequestBody RequestRegistrySaveMoney requestSaveMoney) {
       return registerSaveMoney.registerSaveMoney(
               requestSaveMoney.email(),
               requestSaveMoney.note(),
               requestSaveMoney.savedAmount()
       );
    }
}
