package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.model.User;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistryServ {
    private final UserR userRepository;

    public ResponseEntity<ApiResponse> registerUser(User user){
        if(userRepository.existsByDocumentNumber(user.getDocumentNumber()) || userRepository.existsByEmail(user.getEmail())){
            ResponseEntity.badRequest().body("El usuario ya esta registrado");
            ApiResponse apiResponse = new ApiResponse("400", "El usuario ya esta registrado", false);
            return ResponseEntity.badRequest().body(apiResponse);
        }
        userRepository.save(user);
        ResponseEntity.ok("Usuario registrado con exiro");
        ApiResponse apiResponse = new ApiResponse("200", "Usuario registrado exitosamente", true);
        return ResponseEntity.ok().body(apiResponse);
    }
}
