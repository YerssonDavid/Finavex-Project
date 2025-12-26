package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.responseMovementsMoney.RequestSaveMoney;
import com.semillero.Finavex.dto.responseMovementsMoney.saveMoneyDto;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.services.saveMoney.RegisterSaveMoney;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/save-money")
@RequiredArgsConstructor
public class saveMoneyController {
    private final RegisterSaveMoney registerSaveMoney;

    @PostMapping()
    public ResponseEntity<saveMoneyDto> saveMoney(@RequestBody RequestSaveMoney requestSaveMoney) {
       return registerSaveMoney.registerSaveMoney(
               requestSaveMoney.getUser(),
               requestSaveMoney.getNote(),
               requestSaveMoney.getSavedAmount()
       );
    }
}
