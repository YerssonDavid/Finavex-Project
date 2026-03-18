package com.semillero.Finavex.dto.exception;

import java.time.LocalDateTime;

public record ErrorGeneral(
        String message,
        LocalDateTime timeNow,
        String path
) {
}
