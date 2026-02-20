package com.semillero.Finavex.dto.exception;

import java.time.LocalDateTime;

public record ErrorPlanNotExist(
        int codeStatus,
        String message,
        LocalDateTime timeNow,
        String path
) {
}
