package com.semillero.Finavex.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T> (
        Integer status,
        String message,
        boolean success,
        LocalDateTime timestamp,
        T data
){
}
