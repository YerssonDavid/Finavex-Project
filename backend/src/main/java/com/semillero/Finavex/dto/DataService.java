package com.semillero.Finavex.dto;

import lombok.Builder;

import java.util.Optional;

@Builder
public record DataService (
        Optional<String> email,
        Optional<String> name
){
}
