package com.semillero.Finavex.dto.aiDto;

import jakarta.validation.constraints.NotBlank;

public record RequestAI (
        @NotBlank(message="Mensaje invalido!")
         String question
){
}
