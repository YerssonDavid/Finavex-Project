package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsUser;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsUser;
import com.semillero.Finavex.services.movementsS.RegistrySavingsUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("registry/savings-user")
@RequiredArgsConstructor
public class RegistrySavingsUserController {
    private final RegistrySavingsUser registrySavingsUser;

    @PostMapping
    public ResponseEntity<ResponseRegistrySavingsUser> registrySavings (@Validated @RequestBody RequestRegistrySavingsUser request){
        ResponseRegistrySavingsUser response = registrySavingsUser.registrySavingsUser(request);
        return ResponseEntity.ok(response);
    }
}
