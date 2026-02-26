package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.DataService;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistryExpense {
    private final ExpenseR expenseR;
    private final UserR userR;
    private final CurrencyFormatter currencyFormatter;

    public ResponseRegistryExpense registryExpense (RequestRegistryExpense requestRegistryExpense, DataService dataService){
        Optional<String> email = dataService.email();

        if(!userR.existsByEmail(email.orElse("No se pudo obtener el email!"))){
            throw new UserNotFoundException("El usuario no existe!");
        }

        User persistedUser = userR.findByEmail(email.orElse("No se pudo obtener el email!")).orElseThrow();

        LocalDateTime now = LocalDateTime.now();

        BigDecimal balance = persistedUser.getMoneyNow().getCurrentBalance();
        if(balance.compareTo(requestRegistryExpense.expenseAmount()) < 0){
            throw new IllegalArgumentException("No tienes saldo suficiente para registrar este gasto");
        }

        RegisterExpense registerExpense = new RegisterExpense();
        registerExpense.setUser(persistedUser);
        registerExpense.setAmount(requestRegistryExpense.expenseAmount());
        registerExpense.setDate(now);
        registerExpense.setNoteMovement(requestRegistryExpense.note());
        registerExpense.setMovementType("gasto");

        expenseR.save(registerExpense);

        // Restamos el valor del gasto en la tabla MoneyNow
        boolean existUserMoneyNow = persistedUser.getMoneyNow() != null;

        if(!existUserMoneyNow) {
            MoneyNow moneyNow = new MoneyNow();
            moneyNow.setDateRegister(now);
            moneyNow.setUser(persistedUser);
            BigDecimal money = moneyNow.getCurrentBalance();
            moneyNow.setCurrentBalance(money.subtract(requestRegistryExpense.expenseAmount()));

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
    public void updateMoneyExpense (User user, BigDecimal expenseAmount){
        User userMoneyExpense = userR.findByEmail(user.getEmail()).orElseThrow();

        BigDecimal moneyActually = userMoneyExpense.getMoneyNow().getCurrentBalance();

        userMoneyExpense.getMoneyNow().setCurrentBalance(moneyActually.subtract(expenseAmount));
        userMoneyExpense.getMoneyNow().setDateRegister(LocalDateTime.now());
        userR.save(userMoneyExpense);
    }
}
