package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetMoneyNow;
import com.semillero.Finavex.services.movementsS.GetMoneyNow;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("get/money-now")
@RequiredArgsConstructor
public class GetMoneyNowController {
    private final GetMoneyNow getMoneyNow;

    @GetMapping
    @Operation(
            summary = "Get money now",
            description = "Returns the current amount of money the authenticated user has. The user email is automatically extracted from the JWT token.",
            method = "GET",
            tags = {"Get amount of money current"},
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Current money amount retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseGetMoneyNow.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - Invalid or missing JWT token"
                    )
            }
    )
    public ResponseEntity<ResponseGetMoneyNow> getMoneyNow(){
        return ResponseEntity.ok(getMoneyNow.getMoneyNow());
    }
}
