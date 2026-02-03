package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetMoneyNow;
import com.semillero.Finavex.services.movementsS.GetMoneyNow;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
            description = "Endpoint for get amount of money that you have right now",
            method = "GET",
            tags = {"Get amount of money current"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "It is expected to email",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = String.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<ResponseGetMoneyNow> getMoneyNow(){
        return ResponseEntity.ok(getMoneyNow.getMoneyNow());
    }
}
