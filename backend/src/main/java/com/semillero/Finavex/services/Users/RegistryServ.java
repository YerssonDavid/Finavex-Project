package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.exceptions.DuplicateUserException;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistryServ {
    private final UserR userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario en el sistema
     * @param user Usuario a registrar
     * @return ResponseEntity con la respuesta del registro
     * @throws DuplicateUserException si el usuario ya existe
     */
    public ResponseEntity<ApiResponse<User>> registerUser(User user){
        log.info("Intentando registrar usuario con email: {}", user.getEmail());

        // Verificar si el usuario ya existe
        if(userRepository.existsByDocumentNumber(user.getDocumentNumber())) {
            //Method of SLF4J to log a warning message
            log.warn("Usuario ya existe con ese documento");
            throw new DuplicateUserException("Ya existe un usuario registrado con ese documento");
        }

        if(userRepository.existsByEmail(user.getEmail())) {
            log.warn("Usuario ya existe con email: {}", user.getEmail());
            throw new DuplicateUserException("Ya existe un usuario registrado con el email: " + user.getEmail());
        }

        if(userRepository.existsByPhone(user.getPhone())){
            log.error("Usuario ya existe con el teléfono: {}", user.getPhone());
            throw new DuplicateUserException("Ya existe un usuario registrado con el número telefonico ingresado");
        }

        //Transform email to lowercase and trim spaces
        String email = user.getEmail().toLowerCase().trim();
        user.setEmail(email);

        // Hashear la contraseña
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // Guardar usuario en base de datos
        User savedUser = userRepository.save(user);
        log.info("Usuario registrado exitosamente con ID: {}", savedUser.getId());

        // Construir respuesta exitosa
        ApiResponse<User> apiResponse = ApiResponse.<User>builder()
                .status(HttpStatus.CREATED.value())
                .message("Usuario registrado exitosamente")
                .success(true)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
}
