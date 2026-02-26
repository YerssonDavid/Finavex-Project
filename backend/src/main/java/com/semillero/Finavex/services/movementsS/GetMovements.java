package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.DataService;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.ExpenseR;
import com.semillero.Finavex.repository.movementsR.SaveR;
import com.semillero.Finavex.services.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetMovements {
    private final ExpenseR expenseR;
    private final SaveR saveR;
    private final UserR userR;
    private final TokenProvider tokenProvider;


    public List<ResponseGetMovements> getMovementsUser (DataService dataService) {
        Optional<String> email = dataService.email();

        if(!userR.existsByEmail(email.orElse("No se pudo obtener el email!"))){
            throw new UserNotFoundException("Usuario no encontrado!");
        }

        LocalDateTime time = LocalDateTime.now().minusDays(30);
        List<ResponseGetMovements> movements = new ArrayList<>();
        Long userId = userR.findByEmail(email.orElse("No se pudo obtener el usuario")).get().getId();
        movements.addAll(expenseR.findMovementsByUserId(userId, time));
        movements.addAll(saveR.findMovementsByUserId(userId, time));

        movements.sort(Comparator.comparing(ResponseGetMovements::date).reversed());
        return movements;
    }
}
