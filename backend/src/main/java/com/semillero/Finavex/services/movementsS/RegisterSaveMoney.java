package com.semillero.Finavex.services.movementsS;

import com.semillero.Finavex.dto.responseMovementsMoney.saveMoneyDto;
import com.semillero.Finavex.entity.movements.SaveMoney;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.SaveR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegisterSaveMoney {
    // Inject dependencies here
    private final SaveR SaveR;
    private final UserR userR;
    private final CurrencyFormatter currencyFormatter;

    public ResponseEntity<saveMoneyDto> registerSaveMoney(String email, String noteMovement, Double mountSaved){
        if(!userR.existsByEmail(email.toLowerCase().trim())){
            return ResponseEntity.badRequest().body(new saveMoneyDto(
                            "El usuario no existe",
                            false,
                      null
                    )
            );
        }

        String emailFormat = email.toLowerCase().trim();
        log.warn(emailFormat);

        User persistedUser = userR.findByEmail(emailFormat).orElseThrow();

        LocalDateTime now = LocalDateTime.now();

        SaveMoney saveMoney = new SaveMoney();
        saveMoney.setUser(persistedUser);
        saveMoney.setSavedAmount(mountSaved);
        saveMoney.setDate(now);
        saveMoney.setNoteMovement(noteMovement);

        SaveR.save(saveMoney);

        return ResponseEntity.ok(new saveMoneyDto(
                "Movimiento registrado con éxito",
                true,
                "$" + currencyFormatter.formatCurrencyWithoutSymbol(mountSaved)
                )
        );
    }
}
