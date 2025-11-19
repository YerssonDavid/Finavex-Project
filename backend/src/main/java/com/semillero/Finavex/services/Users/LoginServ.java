package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.config.security.Security;
import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.DtoLogin;
import com.semillero.Finavex.dto.LoginResponse;
import com.semillero.Finavex.model.User;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginServ {
    private final UserR userRepo;
    private final Security security;

    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(DtoLogin dtoLogin){
        if(userRepo.existsByEmail(dtoLogin.getEmail())){
            User userDB = userRepo.findByEmail(dtoLogin.getEmail());
            boolean validationPassword = security.passwordEncoder().matches(dtoLogin.getPassword(), userDB.getPassword());
            if(validationPassword){
                LoginResponse loginResponse = LoginResponse.builder()
                        .userId(userDB.getId())
                        .email(userDB.getEmail())
                        .name(userDB.getName())
                        .build();

                ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                        .status(200)
                        .message("Inicio de sesion exitoso")
                        .success(true)
                        .timestamp(java.time.LocalDateTime.now())
                        .data(loginResponse)
                        .build();
                return ResponseEntity.ok().body(apiResponse);
            } else {
                ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                        .status(401)
                        .message("ERROR, CREDENCIALES INVALIDAS")
                        .success(false)
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
            }
        }
        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .status(400)
                .message("Ups, usuario no encontrado")
                .success(false)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
