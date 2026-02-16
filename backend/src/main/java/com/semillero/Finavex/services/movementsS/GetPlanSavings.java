package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetPlansSavings;
import com.semillero.Finavex.dto.movementsMoney.SavingPlanDto;
import com.semillero.Finavex.entity.movements.SavingsPlan;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SavingsPlanR;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetPlanSavings {
    private final SavingsPlanR savingsPlanR;
    private final UserR userR;

    public ResponseGetPlansSavings getPlanSavings(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String emailFormat = email.toLowerCase().trim();

        Long id = userR.getIdByEmail(emailFormat);

        if(!savingsPlanR.existsByUserId(id)){
            throw new UserNotFoundException("El usuario no tiene un plan de ahorro registrado!");
        } else {
            return new ResponseGetPlansSavings(
                    savingsPlanR.getSavingsPlanByUserId(id)
                            .stream()
                            .map(r -> new SavingPlanDto(
                                    r.getId(),
                                    r.getNameSavingsPlan(),
                                    r.getAmountMetaPlan(),
                                    r.getDescriptionPlanSavings()
                            )).toList()
            );
        }
    }
}
