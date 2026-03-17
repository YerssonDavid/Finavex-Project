package com.semillero.Finavex.services.movementsS.limitExpense;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.movementsMoney.limitExpense.requestRegistryLimitExpense;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.LimitExpense;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.LimitExpenseR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LimitExpenseRegistry {
    private final UserR userR;
    private final LimitExpenseR limitExpenseR;

    public ApiResponse registerLimitExpense(requestRegistryLimitExpense request){
        try{
            String email = SecurityContextHolder.getContext().getAuthentication().getName().toLowerCase().trim();
            BigDecimal value = request.valueLimit();
            log.warn("Email -> {}", email);
            log.warn("Value -> {}", value);

            if(email.isEmpty() && !userR.existsByEmail(email)){
                throw new UserNotFoundException("El usuario no se encuentra!");
            }

            Optional<User> user = userR.findByEmail(email);

            if(user.isEmpty()){
                throw new UserNotFoundException("El usuario no se encuentra registrado!");
            }

            LocalDateTime now = LocalDateTime.now();

            LimitExpense limitExpense = new LimitExpense();
            limitExpense.setIdUser(user.get());
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