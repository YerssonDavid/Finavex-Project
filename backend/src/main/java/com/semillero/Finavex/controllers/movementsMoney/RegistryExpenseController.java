package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistryExpense;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistryExpense;
import com.semillero.Finavex.services.movementsS.RegistryExpense;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expenses/registry")
@RequiredArgsConstructor
public class RegistryExpenseController {
    private final RegistryExpense registryExpense;

    @PostMapping()
    public ResponseEntity<ResponseRegistryExpense> registryExpense(@RequestBody @Valid RequestRegistryExpense requestRegistryExpense){
        ResponseRegistryExpense response = registryExpense.registryExpense(requestRegistryExpense);
        return ResponseEntity.ok().body(response);
    }
}
