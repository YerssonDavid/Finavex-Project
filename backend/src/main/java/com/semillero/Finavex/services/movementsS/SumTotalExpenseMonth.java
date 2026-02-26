package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumTotalExpensesMonth;
import com.semillero.Finavex.repository.movementsR.ExpenseR;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SumTotalExpenseMonth {
    private final ExpenseR expenseR;

    public ResponseSumTotalExpensesMonth sumTotalExpenseMonth(DataService dataService) {
        Optional<String> email = dataService.email();

        if(email.isEmpty() || expenseR.idByEmail(email.orElse("No se pudo obtener el email!")) == null){
            throw new IllegalArgumentException();
        }

        LocalDate now = LocalDate.now();

        LocalDateTime start = now
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime end = start.plusMonths(1);

        Double sum = expenseR.sumByPeriod(start, end, email.orElse("No se pudo obtener el email!"));

        NumberFormat format = NumberFormat.getNumberInstance();
        String sumFormat = format.format(sum);

        return new ResponseSumTotalExpensesMonth(sumFormat);
    }
}
