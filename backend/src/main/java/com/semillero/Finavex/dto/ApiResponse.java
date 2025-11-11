package com.semillero.Finavex.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    public String code;
    public String message;
    public boolean success;
}
