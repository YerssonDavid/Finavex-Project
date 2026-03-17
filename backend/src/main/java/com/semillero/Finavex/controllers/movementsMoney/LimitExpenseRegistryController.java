package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.movementsMoney.limitExpense.RequestRegistryLimitExpense;
import com.semillero.Finavex.services.movementsS.limitExpense.LimitExpenseRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<ApiResponse> registryLimitExpenseC (@RequestBody RequestRegistryLimitExpense request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName().toLowerCase().trim();
        ApiResponse response = limitExpenseRegistry.registerLimitExpense(request, email);
        return ResponseEntity.ok(response);
    }
}
