package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestSumTotalExpensesMonth;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumTotalExpensesMonth;
import com.semillero.Finavex.repository.movementsR.ExpenseR;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SumTotalExpenseMonth {
    private final ExpenseR expenseR;

    public ResponseSumTotalExpensesMonth sumTotalExpenseMonth(RequestSumTotalExpensesMonth requestSumTotalExpensesMonth) {
        String emailFormat = requestSumTotalExpensesMonth.email().trim().toLowerCase();
        if(emailFormat.isEmpty() || expenseR.idByEmail(emailFormat) == null){
            throw new IllegalArgumentException();
        }

        LocalDate now = LocalDate.now();

        LocalDateTime start = now
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime end = start.plusMonths(1);

        Double sum = expenseR.sumByPeriod(start, end, emailFormat);

        NumberFormat format = NumberFormat.getNumberInstance();
        String sumFormat = format.format(sum);

        return new ResponseSumTotalExpensesMonth(sumFormat);
    }
}
