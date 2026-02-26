package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumTotalExpensesMonth;
import com.semillero.Finavex.services.movementsS.SumTotalExpenseMonth;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/expenses/month/sum")
@RequiredArgsConstructor
public class SumTotalExpensesMonthController {
    private final SumTotalExpenseMonth sumTotalExpenseMonth;

    @GetMapping()
    @Operation(
            summary = "Sum total expenses in the last month",
            description = "Returns the total expenses of the authenticated user for the current month. The user email is automatically extracted from the JWT token.",
            method = "GET",
            tags = {"Sum total"},
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Total expenses retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseSumTotalExpensesMonth.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - Invalid or missing JWT token"
                    )
            }
    )
    public ResponseEntity<ResponseSumTotalExpensesMonth> sumTotalExpensesMonth (){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isBlank())
                .map(name -> name.toLowerCase().trim());

        ResponseSumTotalExpensesMonth response = sumTotalExpenseMonth.sumTotalExpenseMonth(DataService.builder().email(email).build());
        return ResponseEntity.ok(response);
    }
}
