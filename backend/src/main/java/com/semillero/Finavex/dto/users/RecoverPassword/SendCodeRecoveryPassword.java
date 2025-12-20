package com.semillero.Finavex.dto.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class SendCodeRecoveryPassword {
    @NotBlank(message="El email es obligatorio")
    @Email(message="El email no tiene un formato válido")
    private String email;
}
