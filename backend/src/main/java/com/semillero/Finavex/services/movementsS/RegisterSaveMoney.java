package com.semillero.Finavex.services.saveMoney;

import com.semillero.Finavex.dto.responseMovementsMoney.saveMoneyDto;
import com.semillero.Finavex.entity.movements.SaveMoney;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.moneyR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RegisterSaveMoney {
    // Inject dependencies here
    private final moneyR moneyR;
    private final UserR userR;
    private final CurrencyFormatter currencyFormatter;

    public ResponseEntity<saveMoneyDto> registerSaveMoney(User user, String noteMovement, Double mountSaved){
        if(!userR.existsByEmail(user.getEmail().toLowerCase().trim())){
            return ResponseEntity.badRequest().body(
                    saveMoneyDto.builder()
                            .message("El usuario no existe")
                            .success(false)
                            .build()
            );
        }

        String email = user.getEmail().toLowerCase().trim();

        User persistedUser = userR.findByEmail(email).orElseThrow();

        LocalDateTime now = LocalDateTime.now();

        SaveMoney saveMoney = new SaveMoney();
        saveMoney.setUser(persistedUser);
        saveMoney.setSavedAmount(mountSaved);
        saveMoney.setDate(now);
        saveMoney.setNoteMovement(noteMovement);

        moneyR.save(saveMoney);

        return ResponseEntity.ok(
                saveMoneyDto.builder()
                        .message("Movimiento registrado con éxito")
                        .success(true)
                        .formattedAmount("$" + currencyFormatter.formatCurrencyWithoutSymbol(mountSaved))
                        .build()
        );
    }
}
