package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsUser;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsUser;
import com.semillero.Finavex.services.movementsS.RegistrySavingsUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("registry/savings-user")
@RestControllerAdvice
@RequiredArgsConstructor
public class RegistrySavingsUserController {
    private final RegistrySavingsUser registrySavingsUser;

    @PostMapping
    public ResponseEntity<ResponseRegistrySavingsUser> registrySavings (@Validated @RequestBody RequestRegistrySavingsUser request){
        Optional<String> email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .filter(name -> !name.isBlank())
                .map(name -> name.toLowerCase().trim());

        ResponseRegistrySavingsUser response = registrySavingsUser.registrySavingsUser(request, DataService.builder().email(email).build());
        return ResponseEntity.ok(response);
    }
}
