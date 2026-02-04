package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements;
import com.semillero.Finavex.services.movementsS.GetMovements;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/movements")
@RequiredArgsConstructor
public class GetMovementsController {
    private final GetMovements getMovements;

    @PostMapping
    @Operation(
            summary = "Get list of movements",
            description = "Endpoint for get the list of movements of the last 30 days of a user",
            method = "POST",
            tags = {"Get list of movements"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "It is expected email and token",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = String.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<List<ResponseGetMovements>> getMovements(){
        List<ResponseGetMovements> movements = getMovements.getMovementsUser();
        return ResponseEntity.ok(movements);
    }
}
