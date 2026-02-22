package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.ResponseSumAllTotalSavingsUser;
import com.semillero.Finavex.services.movementsS.SumAllTotalSavingsUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sumTotal/savings")
@RequiredArgsConstructor
public class SumTotalSavingsUserController {
    private final SumAllTotalSavingsUser sumAllTotalSavingsUser;

    @GetMapping()
    public ResponseEntity<ResponseSumAllTotalSavingsUser> sumAllTotalSavingsUser (){
        ResponseSumAllTotalSavingsUser response = sumAllTotalSavingsUser.sumtotal();
        return ResponseEntity.ok(response);
    }
}
