package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements;
import com.semillero.Finavex.services.movementsS.GetMovements;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/movements")
@RequiredArgsConstructor
public class GetMovementsController {
    private final GetMovements getMovements;

    @GetMapping
    @Operation(
            summary = "Get list of movements",
            description = "Returns the list of movements of the last 30 days for the authenticated user. The user email is automatically extracted from the JWT token.",
            method = "GET",
            tags = {"Get list of movements"},
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Movements retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseGetMovements.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - Invalid or missing JWT token"
                    )
            }
    )
    public ResponseEntity<List<ResponseGetMovements>> getMovements(){
        List<ResponseGetMovements> movements = getMovements.getMovementsUser();
        return ResponseEntity.ok(movements);
    }
}
