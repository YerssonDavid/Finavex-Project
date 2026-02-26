package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseSumAllTotalSavingsUser;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SavingsMoneyUserR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SumAllTotalSavingsUser {
    private final SavingsMoneyUserR savingsUser;
    private final UserR userR;

    public ResponseSumAllTotalSavingsUser sumtotal(DataService dataService){
        Optional<String> email = dataService.email();
        Long idUser = userR.getIdByEmail(email.orElse("Error al obtener email del usuario"));
        log.warn("Id del usuario {}", idUser);

        if(!savingsUser.existsById(idUser)){
            throw new UserNotFoundException("El usuario no existe!");
        }

        BigDecimal sumTotalUser = savingsUser.sumTotalSavingsByEmail(email.orElse("Error al obtener email del usuario"));
        if(sumTotalUser.compareTo(BigDecimal.ZERO)< 0 || sumTotalUser.compareTo(BigDecimal.ZERO) == 0){
            return new ResponseSumAllTotalSavingsUser(BigDecimal.ZERO);
        }
        return new ResponseSumAllTotalSavingsUser(sumTotalUser);
    }
}
