package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.users.RecoverPassword.ChangePasswordDto;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class ChangePassword {
    private User user;

    // Injection of dependencies beans
    private final PasswordEncoder passwordEncoder;
    private final UserR userR;

    public ResponseEntity<ApiResponse> changePassword(ChangePasswordDto changePasswordDto) {

        if(!userR.existsByEmail(changePasswordDto.getEmail())){
           ResponseEntity<ApiResponse> response = ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.builder()
                            .status(HttpStatus.NOT_FOUND.value())
                            .success(false)
                            .timestamp(LocalDateTime.now())
                            .message("Usuario no encontrado con el email proporcionado.")
                            .build()
           );

           return response;
        }

        user = userR.findByEmail(changePasswordDto.getEmail()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // update the password
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));

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
