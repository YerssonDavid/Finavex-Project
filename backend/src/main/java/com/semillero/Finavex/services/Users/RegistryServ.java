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

    public ResponseEntity<ApiResponse<User>> registerUser(User user){
        if(userRepository.existsByDocumentNumber(user.getDocumentNumber()) || userRepository.existsByEmail(user.getEmail())){
            ApiResponse<User> apiResponse = ApiResponse.<User>builder()
                    .status(400)
                    .message("El usuario ya esta registrado")
                    .success(false)
                    .timestamp(java.time.LocalDateTime.now())
                    .build();
            return ResponseEntity.badRequest().body(apiResponse);
        }
        //Get password and apply hash
        String hash = passwordEncoder.encode(user.getPassword());

        //Set hashed password to user
        user.setPassword(hash);

        //Save user in database
        userRepository.save(user);

        ApiResponse<User> apiResponse = ApiResponse.<User>builder()
                .status(200)
                .message("Usuario registrado exitosamente")
                .success(true)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok().body(apiResponse);
    }
}
