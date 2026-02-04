package com.semillero.Finavex.services.recoveryPassword;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.users.RecoverPassword.ChangePasswordDto;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.services.bucked.RateLimitingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class ChangePassword {
    private User user;

    // Injection of dependencies beans
    private final PasswordEncoder passwordEncoder;
    private final UserR userR;
    private final RateLimitingService rateLimitingService;

    public ApiResponse changePassword(ChangePasswordDto changePasswordDto) {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String emailFormat = principal.toString();
        log.info("Email del usuario autenticado: {}", emailFormat);

        if(!userR.existsByEmail(emailFormat)){
            return ApiResponse.builder()
                            .status(HttpStatus.NOT_FOUND.value())
                            .success(false)
                            .timestamp(LocalDateTime.now())
                            .message("Usuario no encontrado con el email proporcionado.")
                            .build();
        }

        user = userR.findByEmail(emailFormat).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // update the password
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));

        // Save the updated User
        userR.save(user);

        // Reset counter in rate limiting service and NumberAttempt of entity user
        user.setNumberAttemptPassword(0);
        rateLimitingService.resetBucket(user.getEmail());

        // Build success response
        return ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .timestamp(LocalDateTime.now())
                .message("Contraseña actualizada exitosamente!")
                .build();
    }
}
