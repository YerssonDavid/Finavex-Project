package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsUser;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsUser;
import com.semillero.Finavex.entity.movements.SavingsMoneyUsers;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SavingsUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrySavingsUser {
    private final SavingsUser savingUser;
    private final UserR userR;

    public ResponseRegistrySavingsUser registrySavingsUser(RequestRegistrySavingsUser request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Email del usuario -> {}", email);
        String emailFormat = email.toLowerCase().trim();

        if(!userR.existsByEmail(emailFormat)){
            throw new UserNotFoundException("El usuario no existe!");
        }

        SavingsMoneyUsers savingsMoneyUsers = new SavingsMoneyUsers();
        savingsMoneyUsers.setEmail(emailFormat);
        savingsMoneyUsers.setAmount(request.amount());
        savingsMoneyUsers.setDateOfRegistry(LocalDateTime.now());
        savingsMoneyUsers.setNameSavings(request.nameSavings());

        savingUser.save(savingsMoneyUsers);

        return new ResponseRegistrySavingsUser (
                true
        );
    }
}
