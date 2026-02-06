package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestSumTotalExpensesMonth;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumTotalExpensesMonth;
import com.semillero.Finavex.services.movementsS.SumTotalExpenseMonth;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expenses/month/sum")
@RequiredArgsConstructor
public class SumTotalExpensesMonthController {
    private final SumTotalExpenseMonth sumTotalExpenseMonth;

    @PostMapping()
    public ResponseEntity<ResponseSumTotalExpensesMonth> sumTotalExpensesMonth (@RequestBody RequestSumTotalExpensesMonth requestSumTotalExpensesMonth){
        ResponseSumTotalExpensesMonth response = sumTotalExpenseMonth.sumTotalExpenseMonth(requestSumTotalExpensesMonth);
        return ResponseEntity.ok(response);
    }
}
