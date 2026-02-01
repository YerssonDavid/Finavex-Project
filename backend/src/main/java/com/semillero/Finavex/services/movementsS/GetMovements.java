package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.movementsMoney.RequestGetMovements;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.ExpenseR;
import com.semillero.Finavex.repository.movementsR.SaveR;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetMovements {
    private final ExpenseR expenseR;
    private final SaveR saveR;
    private final UserR userR;


    public List<ResponseGetMovements> getMovementsUser (RequestGetMovements requestGetMovements){
        String emailFormat = requestGetMovements.email().toLowerCase().trim();
        if(!userR.existsByEmail(emailFormat)){
            throw new UserNotFoundException("Usuario no encontrado!");
        }

        LocalDateTime time = LocalDateTime.now().minusDays(30);
        List<ResponseGetMovements> movements = new ArrayList<>();
        Long userId = userR.findByEmail(emailFormat).get().getId();
        movements.addAll(expenseR.findMovementsByUserId(userId, time));
        movements.addAll(saveR.findMovementsByUserId(userId, time));

        movements.sort(Comparator.comparing(ResponseGetMovements::date));

        return movements;
    }
}
