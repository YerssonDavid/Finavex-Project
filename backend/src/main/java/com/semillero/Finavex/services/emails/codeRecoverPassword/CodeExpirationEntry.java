package com.semillero.Finavex.services.emails.codeRecoverPassword;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class CodeExpirationEntry {
    @Getter
    private Long codeVerification;
    private LocalDateTime createAt;

    public boolean isExpired(LocalDateTime timeRegistry) {
        LocalDateTime timeExpiration = timeRegistry.plusMinutes(10);
        return LocalDateTime.now().isAfter(timeExpiration);
    }
}
