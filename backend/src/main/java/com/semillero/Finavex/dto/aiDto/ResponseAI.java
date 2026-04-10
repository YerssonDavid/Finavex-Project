package com.semillero.Finavex.dto.aiDto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ResponseAI (
        Object response,
        LocalDateTime timeResponse
) {
}
