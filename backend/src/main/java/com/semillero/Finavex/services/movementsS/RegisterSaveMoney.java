package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySaveMoney;
import com.semillero.Finavex.dto.movementsMoney.ResponseSaveMoney;
import com.semillero.Finavex.entity.movements.MoneyNow;
import com.semillero.Finavex.entity.movements.SaveMoney;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SaveR;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegisterSaveMoney {
    // Inject dependencies here
    private final SaveR saveR;
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
        saveMoney.setAmount(requestRegistrySaveMoney.savedAmount());
        saveMoney.setDate(now);
        saveMoney.setNoteMovement(requestRegistrySaveMoney.note());
        saveMoney.setMovementType("INCOME");


        saveR.save(saveMoney);

        boolean existUserMoneyNow = persistedUser.getMoneyNow() != null;

        if(!existUserMoneyNow){
            //Update MoneyNow
            MoneyNow moneyNow = new MoneyNow();
            moneyNow.setUser(persistedUser);
            moneyNow.setDateRegister(now);
            moneyNow.setCurrentBalance(requestRegistrySaveMoney.savedAmount());

            //Save with the repository of User
            persistedUser.setMoneyNow(moneyNow);
            userR.save(persistedUser);

            ResponseSaveMoney responseSaveMoney = new ResponseSaveMoney(
                    "Movimiento registrado con exito",
                    "$" + currencyFormatter.formatCurrencyWithoutSymbol(requestRegistrySaveMoney.savedAmount()),
                    true
            );
            return responseSaveMoney;
        } else {
            //Sum total of BigDecimal (Utilice add in replace of +)
            BigDecimal sum = persistedUser.getMoneyNow().getCurrentBalance().add(requestRegistrySaveMoney.savedAmount());

            updateMoneyNow(sum, persistedUser);

            ResponseSaveMoney responseSaveMoney = new ResponseSaveMoney(
                    "Movimiento actualizado con exito",
                    "$" + currencyFormatter.formatCurrencyWithoutSymbol(requestRegistrySaveMoney.savedAmount()),
                    true
            );
            return responseSaveMoney;
        }
    }


    @Transactional
    public void updateMoneyNow (BigDecimal sumAmount, User user){
        //Find user by email
        User userValid = userR.findByEmail(user.getEmail()).orElseThrow();

        //Update current balance and date register
        userValid.getMoneyNow().setCurrentBalance(sumAmount);
        userValid.getMoneyNow().setDateRegister(LocalDateTime.now());
        userR.save(userValid);
    }
}
