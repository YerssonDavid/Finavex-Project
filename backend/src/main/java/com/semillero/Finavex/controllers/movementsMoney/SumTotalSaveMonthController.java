package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.responseMovementsMoney.RequestSumTotalSaveMonth;
import com.semillero.Finavex.dto.responseMovementsMoney.ResponseSumTotalSaveMonth;
import com.semillero.Finavex.services.movementsS.SumTotalSaveMonth;
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
    public ResponseEntity<ResponseSumTotalSaveMonth> sumTotal(@RequestBody @Validated RequestSumTotalSaveMonth emailRequest){
        ResponseSumTotalSaveMonth response = sumTotalSaveMonth.sumTotalSaveMonth(emailRequest.email().toLowerCase().trim());
        return ResponseEntity.ok(response);
    }
}
