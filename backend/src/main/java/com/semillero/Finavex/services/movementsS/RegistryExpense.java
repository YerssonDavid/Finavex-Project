package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistryExpense;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistryExpense;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.MoneyNow;
import com.semillero.Finavex.entity.movements.RegisterExpense;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.ExpenseR;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RegistryExpense {
    private final ExpenseR expenseR;
    private final UserR userR;
    private final CurrencyFormatter currencyFormatter;

    public ResponseRegistryExpense registryExpense (RequestRegistryExpense requestRegistryExpense){
        String email = requestRegistryExpense.email().trim().toLowerCase();
        if(!userR.existsByEmail(email)){
            throw new UserNotFoundException("El usuario no existe!");
        }

        String emailFormat = requestRegistryExpense.email().toLowerCase().trim();

        User persistedUser = userR.findByEmail(emailFormat).orElseThrow();

        LocalDateTime now = LocalDateTime.now();

        RegisterExpense registerExpense = new RegisterExpense();
        registerExpense.setUser(persistedUser);
        registerExpense.setExpenseAmount(requestRegistryExpense.expenseAmount());
        registerExpense.setDate(now);
        registerExpense.setNoteMovement(requestRegistryExpense.note());

        expenseR.save(registerExpense);

        // Restamos el valor del gasto en la tabla MoneyNow
        boolean existUserMoneyNow = persistedUser.getMoneyNow() != null;

        if(!existUserMoneyNow) {
            MoneyNow moneyNow = new MoneyNow();
            moneyNow.setDateRegister(now);
            moneyNow.setUser(persistedUser);
            Double money = moneyNow.getCurrentBalance();
            moneyNow.setCurrentBalance(money - requestRegistryExpense.expenseAmount());

            persistedUser.setMoneyNow(moneyNow);
            userR.save(persistedUser);
        } else {
            updateMoneyExpense(persistedUser, requestRegistryExpense.expenseAmount());

            ResponseRegistryExpense response = new ResponseRegistryExpense(
                    "Gasto Registrado con exito!",
                    true,
                    "$" + currencyFormatter.formatCurrencyWithoutSymbol(requestRegistryExpense.expenseAmount())
            );
            return response;
        }

        return new
                ResponseRegistryExpense(
                "Gasto Registrado con exito!",
                true,
                "$" + currencyFormatter.formatCurrencyWithoutSymbol(requestRegistryExpense.expenseAmount())
        );
    }

    @Transactional
    public void updateMoneyExpense (User user, Double expenseAmount){
        User userMoneyExpense = userR.findByEmail(user.getEmail()).orElseThrow();

        Double moneyActually = userMoneyExpense.getMoneyNow().getCurrentBalance();

        userMoneyExpense.getMoneyNow().setCurrentBalance(moneyActually - expenseAmount);
        userMoneyExpense.getMoneyNow().setDateRegister(LocalDateTime.now());
        userR.save(userMoneyExpense);
    }
}
