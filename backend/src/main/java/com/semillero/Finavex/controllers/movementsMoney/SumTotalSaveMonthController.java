package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestSumTotalSaveMonth;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumTotalSaveMonth;
import com.semillero.Finavex.services.movementsS.SumTotalSaveMonth;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sum-total-save-month")
@RequiredArgsConstructor
public class SumTotalSaveMonthController {
    private final SumTotalSaveMonth sumTotalSaveMonth;

    @PostMapping()
    @Operation(
            summary = "Sum total of savings for the month",
            description = "Endpoint for summing the total savings of a user in the current month",
            method = "POST",
            tags = {"Sum total"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "It is expected email",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = String.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<ResponseSumTotalSaveMonth> sumTotal(@RequestBody @Validated RequestSumTotalSaveMonth emailRequest){
        ResponseSumTotalSaveMonth response = sumTotalSaveMonth.sumTotalSaveMonth(emailRequest.email().toLowerCase().trim());
        return ResponseEntity.ok(response);
    }
}
