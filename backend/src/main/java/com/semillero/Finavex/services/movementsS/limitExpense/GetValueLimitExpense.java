package com.semillero.Finavex.services.movementsS.limitExpense;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.movementsMoney.limitExpense.ResponseDataRegistryDataBase;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.LimitExpenseR;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GetValueLimitExpense {
    private final UserR userR;
    private final LimitExpenseR limitExpenseR;

    public ApiResponse getValueLimitExpense (String email){
        if(!userR.existsByEmail(email)){
            throw new UserNotFoundException(email);
        }

        try {
            Long idUser = userR.getIdByEmail(email);
            ResponseDataRegistryDataBase value = limitExpenseR.findByIdUser_Id(idUser);

            return new ApiResponse(
                    200,
                    "Se obtuvieron los datos correctamente",
                    true,
                    LocalDateTime.now(),
                    value
            );
        } catch(Exception e){
            throw new RuntimeException("Error al obtener los datos!");
        }
    }
}