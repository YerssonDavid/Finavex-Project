package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestGetMoneyNow;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetMoneyNow;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;

@Service
@Slf4j
@RequiredArgsConstructor
public class GetMoneyNow {
    private final UserR userR;

    public ResponseGetMoneyNow getMoneyNow (RequestGetMoneyNow requestGetMoneyNow){
        String emailFormat = requestGetMoneyNow.email().toLowerCase().trim();

        if(userR.existsByEmail(emailFormat)){
            User user = userR.findByEmail(emailFormat).orElseThrow();
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
            log.error("El usuario no existe! {}", requestGetMoneyNow.email());
            throw new UserNotFoundException("El usuario no existe!");
        }
    }
}
