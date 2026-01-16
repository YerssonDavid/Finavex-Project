package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.responseMovementsMoney.RequestRegistryExpense;
import com.semillero.Finavex.dto.responseMovementsMoney.ResponseRegistryExpense;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.RegisterExpense;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.ExpenseR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RegistryExpense {
    private final ExpenseR expenseR;
    private final UserR userR;
    private final CurrencyFormatter currencyFormatter;

    public ResponseEntity<ResponseRegistryExpense> registryExpense (RequestRegistryExpense requestRegistryExpense){
        if(!userR.existsByEmail(requestRegistryExpense.email())){
            ResponseRegistryExpense responseFail = new ResponseRegistryExpense(
                    "El usuario no existe!",
                    false,
                    null
            );
            return ResponseEntity.badRequest().body(responseFail);
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

        return ResponseEntity.ok( new
                ResponseRegistryExpense(
                "Gasto Registrado con exito!",
                true,
                "$" + currencyFormatter.formatCurrencyWithoutSymbol(requestRegistryExpense.expenseAmount())
                )
        );
    }
}
