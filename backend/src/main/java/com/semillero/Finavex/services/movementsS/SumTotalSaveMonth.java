package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.responseMovementsMoney.ResponseSumTotalSaveMonth;
import com.semillero.Finavex.repository.movementsR.SaveR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SumTotalSaveMonth {
    private final SaveR saveR;

    public ResponseSumTotalSaveMonth sumTotalSaveMonth (String email){
        if(email == null || email.isEmpty() || !saveR.existsByEmail(email)){
            log.error("El email no existe o no es llega!");
            throw new IllegalArgumentException("El email ingresado no es valido!");
        }

        LocalDate now = LocalDate.now();

        LocalDateTime start = now
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime end = start.plusMonths(1);

        Double sum = saveR.sumByPeriod(start, end, email);

        NumberFormat format = NumberFormat.getCurrencyInstance();
        String sumFormat = format.format(sum);

        return new ResponseSumTotalSaveMonth(sumFormat);
    }
}
