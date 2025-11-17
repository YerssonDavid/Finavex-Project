package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.config.security.Security;
import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.DtoLogin;
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

    public ResponseEntity<ApiResponse> loginUser(DtoLogin dtoLogin){
        if(userRepo.existsByEmail(dtoLogin.getEmail())){
            User userDB = userRepo.findByEmail(dtoLogin.getEmail());
            boolean validationPassword = security.passwordEncoder().matches(dtoLogin.getPassword(), userDB.getPassword());
            if(validationPassword){
                ApiResponse apiResponse = new ApiResponse("200", "Inicio de sesion exitoso", true);
                return ResponseEntity.ok().body(apiResponse);
            }
        } else{
            ApiResponse apiResponse = new ApiResponse("400", "Ups, usuario no encontrado", false);
            return ResponseEntity.badRequest().body(apiResponse);
        }
        ApiResponse apiResponse = new ApiResponse("401", "ERROR, CREDENCIALES INVALIDAS", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(apiResponse);
    }
}
