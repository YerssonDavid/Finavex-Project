package com.semillero.Finavex.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@ToString(exclude = "password")
@AllArgsConstructor
@NoArgsConstructor
public class DtoLogin {
    @Email(message = "Invalid email format")
    @NotBlank(message = "El email es obligatorio")
    private String email;

    @NotBlank(message="La contraseña es obligatoria")
    @Size(min=8, message="Minimo puede tener 8 caracteres la contraseña")
    private String password;
}
