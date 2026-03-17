package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.movementsMoney.limitExpense.requestRegistryLimitExpense;
import com.semillero.Finavex.services.movementsS.limitExpense.LimitExpenseRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/registry/limitExpense")
public class LimitExpenseRegistryController {
    private final LimitExpenseRegistry limitExpenseRegistry;

    @PostMapping()
    public ResponseEntity<ApiResponse> registryLimitExpenseC (@RequestBody requestRegistryLimitExpense request){
        ApiResponse response = limitExpenseRegistry.registerLimitExpense(request);
        return ResponseEntity.ok(response);
    }
}
