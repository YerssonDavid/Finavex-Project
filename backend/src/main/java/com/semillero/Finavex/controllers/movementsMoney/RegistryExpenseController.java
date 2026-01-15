package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.responseMovementsMoney.RequestRegistryExpense;
import com.semillero.Finavex.dto.responseMovementsMoney.ResponseRegistryExpense;
import com.semillero.Finavex.services.movementsS.RegistryExpense;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expenses/registry")
@RequiredArgsConstructor
public class RegistryExpenseController {
    private final RegistryExpense registryExpense;

    @PostMapping()
    public ResponseEntity<ResponseRegistryExpense> registryExpense(@RequestBody RequestRegistryExpense requestRegistryExpense){
        return registryExpense.registryExpense(requestRegistryExpense);
    }
}
