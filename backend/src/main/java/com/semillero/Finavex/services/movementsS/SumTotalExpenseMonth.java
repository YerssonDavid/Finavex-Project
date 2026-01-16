package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.responseMovementsMoney.RequestSumTotalExpensesMonth;
import com.semillero.Finavex.dto.responseMovementsMoney.ResponseSumTotalExpensesMonth;
import com.semillero.Finavex.repository.movementsR.ExpenseR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SumTotalExpenseMonth {
    private final ExpenseR expenseR;

    public ResponseEntity<ResponseSumTotalExpensesMonth> sumTotalExpenseMonth(RequestSumTotalExpensesMonth requestSumTotalExpensesMonth) {
        if(requestSumTotalExpensesMonth.email() == null || requestSumTotalExpensesMonth.email().isEmpty() || expenseR.idByEmail(requestSumTotalExpensesMonth.email()) == null){
            return ResponseEntity.badRequest().build();
        }

        LocalDate now = LocalDate.now();

        LocalDateTime start = now
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime end = start.plusMonths(1);

        Double sum = expenseR.sumByPeriod(start, end, requestSumTotalExpensesMonth.email());

        NumberFormat format = NumberFormat.getNumberInstance();
        String sumFormat = format.format(sum);

        return ResponseEntity.ok(new ResponseSumTotalExpensesMonth(sumFormat));
    }
}
