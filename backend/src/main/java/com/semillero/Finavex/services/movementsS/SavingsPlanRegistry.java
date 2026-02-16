package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsPlan;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.SavingsPlan;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SavingsPlanR;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SavingsPlanRegistry {
    private final SavingsPlanR savingsPlanR;
    private final UserR userR;

    public ResponseRegistrySavingsPlan registrySavingPlan (RequestRegistrySavingsPlan requestRegistrySavingsPlan){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String emailFormat = email.toLowerCase().trim();

        if(!userR.existsByEmail(emailFormat)){
            throw new UserNotFoundException("Usuario no encontrado");
        }

        Long userId = userR.getIdByEmail(emailFormat);
        User user = userR.getReferenceById(userId);

        SavingsPlan savingsPlan = new SavingsPlan();
        savingsPlan.setAmountMetaPlan(requestRegistrySavingsPlan.amountMetaPlan());
        savingsPlan.setNameSavingsPlan(requestRegistrySavingsPlan.nameSavingsPlan());
        savingsPlan.setDescriptionPlanSavings(requestRegistrySavingsPlan.descriptionPlanSavings());
        savingsPlan.setUser(user);

        savingsPlanR.save(savingsPlan);

        return new ResponseRegistrySavingsPlan(
                "Plan de ahorro registrado exitosamente!",
                true
        );
    }

}
