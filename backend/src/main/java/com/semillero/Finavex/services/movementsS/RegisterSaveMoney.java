package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.responseMovementsMoney.RequestRegistrySaveMoney;
import com.semillero.Finavex.dto.responseMovementsMoney.ResponseSaveMoney;
import com.semillero.Finavex.dto.responseMovementsMoney.saveMoneyDto;
import com.semillero.Finavex.entity.movements.SaveMoney;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SaveR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegisterSaveMoney {
    // Inject dependencies here
    private final SaveR SaveR;
    private final UserR userR;
    private final CurrencyFormatter currencyFormatter;

    public ResponseSaveMoney registerSaveMoney(RequestRegistrySaveMoney requestRegistrySaveMoney){
        if(!userR.existsByEmail(requestRegistrySaveMoney.email().toLowerCase().trim())){
            throw new UserNotFoundException("El usuario no existe");
        }

        String emailFormat = requestRegistrySaveMoney.email().toLowerCase().trim();
        log.warn(emailFormat);

        User persistedUser = userR.findByEmail(emailFormat).orElseThrow();

        LocalDateTime now = LocalDateTime.now();

        SaveMoney saveMoney = new SaveMoney();
        saveMoney.setUser(persistedUser);
        saveMoney.setSavedAmount(requestRegistrySaveMoney.savedAmount());
        saveMoney.setDate(now);
        saveMoney.setNoteMovement(requestRegistrySaveMoney.note());

        SaveR.save(saveMoney);

        ResponseSaveMoney responseSaveMoney = new ResponseSaveMoney(
                "Movimiento registrado con exito",
                "$" + currencyFormatter.formatCurrencyWithoutSymbol(requestRegistrySaveMoney.savedAmount()),
                true
        );
        return responseSaveMoney;
    }
}
