package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumTotalSaveMonth;
import com.semillero.Finavex.services.movementsS.SumTotalSaveMonth;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/sum-total-save-month")
@RequiredArgsConstructor
public class SumTotalSaveMonthController {
    private final SumTotalSaveMonth sumTotalSaveMonth;

    @GetMapping()
    @Operation(
            summary = "Sum total of savings for the month",
            description = "Returns the total savings of the authenticated user for the current month. The user email is automatically extracted from the JWT token.",
            method = "GET",
            tags = {"Sum total"},
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Total savings retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseSumTotalSaveMonth.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - Invalid or missing JWT token"
                    )
            }
    )
    public ResponseEntity<ResponseSumTotalSaveMonth> sumTotal(){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isBlank())
                .map(name -> name.toLowerCase().trim());

        ResponseSumTotalSaveMonth response = sumTotalSaveMonth.sumTotalSaveMonth(DataService.builder().email(email).build());
        return ResponseEntity.ok(response);
    }
}