package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.responseMovementsMoney.RequestRegistryExpense;
import com.semillero.Finavex.dto.responseMovementsMoney.ResponseRegistryExpense;
import com.semillero.Finavex.services.movementsS.RegistryExpense;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/expenses/registry")
@RequiredArgsConstructor
public class RegistryExpenseController {
    private final RegistryExpense registryExpense;

    @PostMapping()
    public ResponseEntity<ResponseRegistryExpense> registryExpense(@RequestParam RequestRegistryExpense requestRegistryExpense){
        return registryExpense.registryExpense(requestRegistryExpense);
    }
}
