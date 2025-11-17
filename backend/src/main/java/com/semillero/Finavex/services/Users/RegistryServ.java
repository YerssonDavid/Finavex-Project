package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.model.User;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistryServ {
    private final UserR userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<ApiResponse> registerUser(User user){
        if(userRepository.existsByDocumentNumber(user.getDocumentNumber()) || userRepository.existsByEmail(user.getEmail())){
            ResponseEntity.badRequest().body("El usuario ya esta registrado");
            ApiResponse apiResponse = new ApiResponse("400", "El usuario ya esta registrado", false);
            return ResponseEntity.badRequest().body(apiResponse);
        }
        //Get password and apply hash
        String hash = passwordEncoder.encode(user.getPassword());

        //Set hashed password to user
        user.setPassword(hash);

        userRepository.save(user);
        ResponseEntity.ok("Usuario registrado con exito");
        ApiResponse apiResponse = new ApiResponse("200", "Usuario registrado exitosamente", true);
        return ResponseEntity.ok().body(apiResponse);
    }
}
