package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetMoneyNow;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class GetMoneyNow {
    private final UserR userR;

    public ResponseGetMoneyNow getMoneyNow (DataService dataService){
        Optional<String> email = dataService.email();

        if(userR.existsByEmail(email.orElse("No se encontro el email!"))){
            User user = userR.findByEmail(email.orElse("No se encontro el email!")).orElseThrow();
            BigDecimal amount = user.getMoneyNow().getCurrentBalance();

            //Format amount
            NumberFormat format = NumberFormat.getCurrencyInstance();
            String numberFormat = format.format(amount);

            //Return response
            ResponseGetMoneyNow response = new ResponseGetMoneyNow (
                    numberFormat
            );
            return response;
        } else {
            log.error("El usuario no existe! {}", email.orElse("No se encontro el email!"));
            throw new UserNotFoundException("El usuario no existe!");
        }
    }
}
