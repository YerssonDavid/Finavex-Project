package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumAllTotalSavingsUser;
import com.semillero.Finavex.services.movementsS.SumAllTotalSavingsUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/sumTotal/savings")
@RequiredArgsConstructor
public class SumTotalSavingsUserController {
    private final SumAllTotalSavingsUser sumAllTotalSavingsUser;

    @GetMapping()
    public ResponseEntity<ResponseSumAllTotalSavingsUser> sumAllTotalSavingsUser (){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.trim().isEmpty())
                .map(name -> name.toLowerCase().trim());

        ResponseSumAllTotalSavingsUser response = sumAllTotalSavingsUser.sumtotal(DataService.builder().email(email).build());
        return ResponseEntity.ok(response);
    }
}
