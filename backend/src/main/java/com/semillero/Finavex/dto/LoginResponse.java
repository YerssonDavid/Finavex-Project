package com.semillero.Finavex.dto;

import lombok.Builder;

@Builder
public record LoginResponse (
        Long userId,
        String email,
        String name,
        String token
){
}

