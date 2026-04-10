package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.services.movementsS.limitExpense.GetValueLimitExpense;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("get/data/limit-expense")
@RequiredArgsConstructor
public class GetValueLimitExpenseController {
    private final GetValueLimitExpense getValueLimitExpense;

    @GetMapping
    @Operation(
            summary = "Get data limit expense",
            description = "Get the expense limit configuration for the authenticated user.",
            method = "GET",
            tags = {"Expense Limits"},
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Data retrieved successfully"
                    )
            }
    )
    public ResponseEntity<ApiResponse> getValueLimitExpense(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        ApiResponse response = getValueLimitExpense.getValueLimitExpense(email);
        return ResponseEntity.ok(response);
    }
}