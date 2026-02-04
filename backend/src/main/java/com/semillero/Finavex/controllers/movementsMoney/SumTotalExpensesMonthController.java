package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.ResponseSumTotalExpensesMonth;
import com.semillero.Finavex.services.movementsS.SumTotalExpenseMonth;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expenses/month/sum")
@RequiredArgsConstructor
public class SumTotalExpensesMonthController {
    private final SumTotalExpenseMonth sumTotalExpenseMonth;

    @PostMapping()
    @Operation(
            summary = "Sum total expenses in the last month",
            description = "Endpoint for get sum total of expenses in the last month",
            method = "POST",
            tags = {"Sum total"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "It is expected to email",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = String.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<ResponseSumTotalExpensesMonth> sumTotalExpensesMonth (){
        ResponseSumTotalExpensesMonth response = sumTotalExpenseMonth.sumTotalExpenseMonth();
        return ResponseEntity.ok(response);
    }
}
