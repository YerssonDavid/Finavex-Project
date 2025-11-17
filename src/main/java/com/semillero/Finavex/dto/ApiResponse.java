package com.semillero.Finavex.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private String code;
    private String message;
    private boolean success;
}
