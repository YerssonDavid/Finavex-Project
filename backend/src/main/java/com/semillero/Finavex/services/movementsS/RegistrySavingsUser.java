package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsUser;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsUser;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.SavingsMoneyUsers;
import com.semillero.Finavex.entity.movements.SavingsMovements;
import com.semillero.Finavex.entity.movements.SavingsPlan;
import com.semillero.Finavex.exceptions.PlanNotExist;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SavingsMovementsR;
import com.semillero.Finavex.repository.movementsR.SavingsPlanR;
import com.semillero.Finavex.repository.movementsR.SavingsMoneyUserR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrySavingsUser {
    private final SavingsMoneyUserR savingUser;
    private final SavingsPlanR savingsPlanR;
    private final SavingsMovementsR savingsMovementsR;
    private final UserR userR;

    public ResponseRegistrySavingsUser registrySavingsUser(RequestRegistrySavingsUser request, DataService dataService){
        Optional<String> email = dataService.email();

        Long idUser = userR.getIdByEmail(email.orElse("No se puedo obtener el email!"));

        User user = userR.findById(idUser)
                .orElseThrow(() -> new UserNotFoundException("El usuario no existe!"));


        if(!userR.existsByEmail(user.getEmail())){
            throw new UserNotFoundException("El usuario no existe!");
        }

        List<SavingsPlan> savingsPlanList = savingsPlanR.getSavingsPlanByUserId(idUser);

        if(savingsPlanList.isEmpty()){
            throw new UserNotFoundException("El usuario no tiene planes de ahorro registrados!");
        } else if (!savingsPlanR.existsById(request.idPlan())){
            throw new PlanNotExist("El plan de ahorro no existe!");
        }

        SavingsPlan savingsPlan = savingsPlanList.stream()
                .filter(p -> p.getId().equals(request.idPlan()) && p.getUser().getId().equals(idUser))
                .findFirst()
                .orElseThrow(() -> new PlanNotExist("El plan de ahorro no existe o no pertenece al usuario!"));

        // Save in table of Savings Movements
        SavingsMovements savingsMovements = new SavingsMovements();
        savingsMovements.setAmount(request.amount());
        savingsMovements.setDateRegistry(LocalDateTime.now());
        savingsMovements.setSavingsPlan(savingsPlan);
        savingsMovementsR.save(savingsMovements);

        //Save in table de money user
        SavingsMoneyUsers savingsMoneyUsers = new SavingsMoneyUsers();
        savingsMoneyUsers.setUser(user);
        savingsMoneyUsers.setNameSavings(savingsMovements.getSavingsPlan().getNameSavingsPlan());
        savingsMoneyUsers.setAmount(request.amount());
        savingsMoneyUsers.setDateOfRegistry(LocalDateTime.now());
        savingUser.save(savingsMoneyUsers);

        return new ResponseRegistrySavingsUser(true);
    }
}
