package com.semillero.Finavex.services.movementsS.limitExpense;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.movementsMoney.limitExpense.RequestRegistryLimitExpense;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.LimitExpense;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.LimitExpenseR;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LimitExpenseRegistry {
    private final UserR userR;
    private final LimitExpenseR limitExpenseR;

    public ApiResponse registerLimitExpense(RequestRegistryLimitExpense request, String email){
        try{
            BigDecimal value = request.valueLimit();

            if(email.isEmpty() || !userR.existsByEmail(email)){
                throw new UserNotFoundException("El usuario no se encuentra!");
            } else if (value.compareTo(BigDecimal.ZERO) <= 0){
                throw new IllegalArgumentException("El valor debe ser mayor a 0");
            }

            User user = userR.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("El usuario no se encuentra!"));

            LocalDateTime now = LocalDateTime.now();

            LimitExpense limitExpense = new LimitExpense();
            limitExpense.setIdUser(user);
            limitExpense.setValueLimit(request.valueLimit());
            limitExpense.setExpirationDate(request.expirationDateRegistry());
            limitExpense.setDateRegistryLimit(now);

            limitExpenseR.save(limitExpense);

            return new ApiResponse<>(
                    200,
                    "Registro Exitoso!",
                    true,
                    LocalDateTime.now(),
                    limitExpense.getDateRegistryLimit()
            );
        }catch(Exception e){
            throw new UserNotFoundException("Error, intenta más tarde");
        }
    }
}