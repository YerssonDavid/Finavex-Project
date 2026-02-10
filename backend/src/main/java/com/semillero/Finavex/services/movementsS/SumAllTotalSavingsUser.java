package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.ResponseSumAllTotalSavingsUser;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SavingsUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SumAllTotalSavingsUser {
    private final SavingsUser savingsUser;
    private final UserR userR;

    public ResponseSumAllTotalSavingsUser sumtotal(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String emailFormat = email.toLowerCase().trim();

        Long idUser = userR.getIdByEmail(emailFormat);

        if(!savingsUser.existsById(idUser)){
            throw new UserNotFoundException("El usuario no existe!");
        }

        BigDecimal sumTotalUser = savingsUser.sumTotalSavingsByEmail(emailFormat);
        if(sumTotalUser.compareTo(BigDecimal.ZERO)< 0 || sumTotalUser.compareTo(BigDecimal.ZERO) == 0){
            return new ResponseSumAllTotalSavingsUser(BigDecimal.ZERO);
        }
        return new ResponseSumAllTotalSavingsUser(sumTotalUser);
    }
}
