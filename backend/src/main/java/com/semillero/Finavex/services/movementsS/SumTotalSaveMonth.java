package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.repository.movementsR.ExpenseR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SumTotalSaveMonth {
    private final ExpenseR expenseR;

    public ResponseEntity<Double> sumTotalExpenseMonth(String email) {
        if(email == null || email.isEmpty() || expenseR.idByEmail(email) == null){
            return ResponseEntity.badRequest().build();
        }

        LocalDate now = LocalDate.now();

        LocalDateTime start = now
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime end = start.plusMonths(1);

        Double sum = expenseR.sumByPeriod(start, end, email);
        return ResponseEntity.ok(sum);
    }
}
