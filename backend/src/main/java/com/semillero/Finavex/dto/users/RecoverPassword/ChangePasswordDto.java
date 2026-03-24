package com.semillero.Finavex.dto.users.RecoverPassword;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangePasswordDto {
    @NotBlank(message="La contraseña es obligatoria")
    private String newPassword;
}
