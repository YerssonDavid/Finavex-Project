package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestGetMoneyNow;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetMoneyNow;
import com.semillero.Finavex.services.movementsS.GetMoneyNow;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("get/money-now")
@RequiredArgsConstructor
public class GetMoneyNowController {
    private final GetMoneyNow getMoneyNow;

    @PostMapping
    @Operation(
            summary = "Get money now",
            description = "Endpoint for get amount of money that you have right now",
            method = "POST",
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
    public ResponseEntity<ResponseGetMoneyNow> getMoneyNow(@Valid @RequestBody RequestGetMoneyNow requestGetMoneyNow){
        return ResponseEntity.ok(getMoneyNow.getMoneyNow(requestGetMoneyNow));
    }
}
