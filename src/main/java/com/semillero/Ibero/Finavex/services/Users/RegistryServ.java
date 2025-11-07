package com.semillero.Ibero.Finavex.services.Users;

import com.semillero.Ibero.Finavex.model.User;
import com.semillero.Ibero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Registry {
    private final UserR userRepository;

    public ResponseEntity<String> registerUser(User user){
        if(userRepository.existsById(user.getId())){
            return ResponseEntity.badRequest().body("El usuario ya esta registrado");
        }
        userRepository.save(user);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
