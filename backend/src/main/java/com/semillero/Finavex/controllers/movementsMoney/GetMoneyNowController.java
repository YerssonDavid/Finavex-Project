package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestGetMoneyNow;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetMoneyNow;
import com.semillero.Finavex.services.movementsS.GetMoneyNow;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("get/money-now")
@RequiredArgsConstructor
public class GetMoneyNowController {
    private final GetMoneyNow getMoneyNow;

    @PostMapping
    public ResponseEntity<ResponseGetMoneyNow> getMoneyNow(@Valid @RequestBody RequestGetMoneyNow requestGetMoneyNow){
        return ResponseEntity.ok(getMoneyNow.getMoneyNow(requestGetMoneyNow));
    }
}
