package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class ChangePassword {
    private User user;

    // Injection of dependencies beans
    private final PasswordEncoder passwordEncoder;
    private final UserR userR;

    public ResponseEntity<ApiResponse> changePassword(String oldPassword, String newPassword) {

        // Check if the old password matches
        if (!user.getPassword().matches(oldPassword)) {
            ApiResponse<Object> responseError = ApiResponse.builder()
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .success(false)
                    .timestamp(LocalDateTime.now())
                    .message("La contraseña ingresada es incorrecta!")
                    .build();
            return new ResponseEntity<>(responseError, HttpStatus.UNAUTHORIZED);
        }

        // update the password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Save the updated User
        userR.save(user);

        // Build success response
        ApiResponse<Object> responseOk = ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .timestamp(LocalDateTime.now())
                .message("Contraseña actualizada exitosamente!")
                .build();
        return ResponseEntity.ok(responseOk);
    }
}
