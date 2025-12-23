package com.semillero.Finavex.dto.users.RecoverPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangePasswordDto {
    @NotBlank(message="El email es obligatorio")
    @Email(message="El email no es valido!")
    private String email;

    @NotBlank(message="La contraseña es obligatoria")
    private String newPassword;
}
