package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsUser;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsUser;
import com.semillero.Finavex.entity.User;
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
        String emailFormat = email.toLowerCase().trim();

        // Obtener el usuario autenticado
        User user = userR.findByEmail(emailFormat)
                .orElseThrow(() -> new UserNotFoundException("El usuario no existe!"));

        SavingsMoneyUsers savingsMoneyUsers = new SavingsMoneyUsers();
        savingsMoneyUsers.setUser(user);  // Asignar el usuario propietario
        savingsMoneyUsers.setAmount(request.amount());
        savingsMoneyUsers.setDateOfRegistry(LocalDateTime.now());
        savingsMoneyUsers.setNameSavings(request.nameSavings());

        savingUser.save(savingsMoneyUsers);

        return new ResponseRegistrySavingsUser(true);
    }
}
