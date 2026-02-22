package com.semillero.Finavex.dto.exception;

import java.time.LocalDateTime;

public record ErrorGeneral(
        int codeStatus,
        String message,
        LocalDateTime timeNow,
        String path
) {
}
