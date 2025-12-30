package com.semillero.Finavex.dto.aiDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseAI {
    private String response;
    private LocalDateTime timeResponse;
}
