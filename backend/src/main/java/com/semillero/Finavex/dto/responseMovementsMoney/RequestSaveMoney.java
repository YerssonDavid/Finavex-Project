package com.semillero.Finavex.dto.responseMovementsMoney;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestSaveMoney {
    private Double savedAmount;
    private String note;
    private LocalDate date;

    @NotBlank(message="El email no puede estar vacio")
    @Email(message="El email debe tener un formato valido")
    private String email;
}
