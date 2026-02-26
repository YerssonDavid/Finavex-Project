package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseListRegistrySavingsPlan;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsPlan;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.SavingsPlan;
import com.semillero.Finavex.exceptions.ExistElement;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SavingsPlanR;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SavingsPlanRegistry {
    private final SavingsPlanR savingsPlanR;
    private final UserR userR;

    public ResponseRegistrySavingsPlan registrySavingPlan (RequestRegistrySavingsPlan requestRegistrySavingsPlan, DataService dataService) {
        Optional<String> email = dataService.email();

        Long idUser = userR.getIdByEmail(email.orElse("No se pudo obtener el email!"));

        List<SavingsPlan> listPlansUser = savingsPlanR.getSavingsPlanByUserId(idUser);

        if(!userR.existsByEmail(email.orElse("No se pudo obtener el email!"))){
            throw new UserNotFoundException("Usuario no encontrado");
        } else if (listPlansUser.stream()
                //Compare in list with the name of that the user want to registry.
                        .anyMatch(p -> p.getNameSavingsPlan().equals(requestRegistrySavingsPlan.nameSavingsPlan()))){
            throw new ExistElement("El plan de ahorro ya existe, por favor elige otro nombre");
        }

        Long userId = userR.getIdByEmail(email.orElse("No se pudo obtener el email!"));
        User user = userR.getReferenceById(userId);

        SavingsPlan savingsPlan = new SavingsPlan();
        savingsPlan.setAmountMetaPlan(requestRegistrySavingsPlan.amountMetaPlan());
        savingsPlan.setNameSavingsPlan(requestRegistrySavingsPlan.nameSavingsPlan());
        savingsPlan.setDescriptionPlanSavings(requestRegistrySavingsPlan.descriptionPlanSavings());
        savingsPlan.setUser(user);

        savingsPlanR.save(savingsPlan);

        // Get ID and name of the registered savings plan
        Long id = savingsPlan.getId();

        // Escape the name to prevent XSS attacks
        String name = HtmlUtils.htmlEscape(savingsPlan.getNameSavingsPlan());

        return new ResponseRegistrySavingsPlan(
                "Plan de ahorro registrado exitosamente!",
                true,
                id,
                name
        );
    }

    // Implement method that return the name and id of the savings plan registered
    public List<ResponseListRegistrySavingsPlan> listRegistrySavingsPlan (DataService dataService) {
        Optional<String> email = dataService.email();

        if(!userR.existsByEmail(email.orElse("No se pudo obtener el email!"))){
            throw new UserNotFoundException("El usuario no existe!");
        }

        Long userId = userR.getIdByEmail(email.orElse("No se pudo obtener el email!"));

        if(!savingsPlanR.existsByUserId(userId)){
             // Si prefieres lanzar excepción cuando no hay datos:
            throw new UserNotFoundException("El usuario no tiene un plan de ahorro registrado!");
             // O retornar lista vacía (más standard en REST): return List.of();
        }

        return savingsPlanR.getSavingsPlanByUserId(userId).stream()
                .filter(n -> n.getNameSavingsPlan() != null && n.getId() != null)
                .map(plan -> new ResponseListRegistrySavingsPlan(
                        plan.getId(),
                        HtmlUtils.htmlEscape(plan.getNameSavingsPlan()) // Sanitizamos el nombre de salida por seguridad
                ))
                .toList();
    }
}
