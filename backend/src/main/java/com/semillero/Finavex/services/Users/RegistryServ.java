package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.users.registryUser.RegistryUserDto;
import com.semillero.Finavex.exceptions.DuplicateUserException;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistryServ {
    private final UserR userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario en el sistema
     * @param registryUserDto Usuario a registrar
     * @return ApiResponse con la respuesta del registro
     * @throws DuplicateUserException si el usuario ya existe
     */
    public ApiResponse<User> registerUser(RegistryUserDto registryUserDto){
        log.info("Intentando registrar usuario con email: {}", registryUserDto.email());

        // Verificar si el usuario ya existe
        if(userRepository.existsByDocumentNumber(registryUserDto.documentNumber())) {
            //Method of SLF4J to log a warning message
            log.warn("Usuario ya existe con ese documento");
            throw new DuplicateUserException("Ya existe un usuario registrado con ese documento");
        }

        if(userRepository.existsByEmail(registryUserDto.email())) {
            log.warn("Usuario ya existe con email: {}", registryUserDto.email());
            throw new DuplicateUserException("Ya existe un usuario registrado con el email: " + registryUserDto.email());
        }

        if(userRepository.existsByPhone(registryUserDto.phone())){
            log.error("Usuario ya existe con el teléfono: {}", registryUserDto.phone());
            throw new DuplicateUserException("Ya existe un usuario registrado con el número telefonico ingresado");
        }

        //Transform email to lowercase and trim spaces
        String email = registryUserDto.email().toLowerCase().trim();
        registryUserDto.withEmail(email);

        // Create new user
        User userNew = new User();
        userNew.setName(registryUserDto.name());
        userNew.setMiddleName(registryUserDto.middleName());
        userNew.setSurname(registryUserDto.surname());
        userNew.setSecondSurname(registryUserDto.secondSurname());
        userNew.setDocumentNumber(registryUserDto.documentNumber());
        userNew.setDateOfBirth(registryUserDto.dateOfBirth());
        userNew.setPhone(registryUserDto.phone());
        userNew.setEmail(email);
        userNew.setPassword(registryUserDto.password());

        //Get date birth and set age
        LocalDate dateBirthLocalDate = LocalDate.parse(registryUserDto.dateOfBirth());
        LocalDate dateNow = LocalDate.now();
        Period ageExact = Period.between(dateBirthLocalDate, dateNow);
        Integer age = ageExact.getYears();
        userNew.setAge(age);

        // Hashear la contraseña
        String hashedPassword = passwordEncoder.encode(userNew.getPassword());
        userNew.setPassword(hashedPassword);

        // Guardar usuario en base de datos
        User savedUser = userRepository.save(userNew);
        log.info("Usuario registrado exitosamente con ID: {}", savedUser.getId());

        // Construir respuesta exitosa
        ApiResponse<User> apiResponse = ApiResponse.<User>builder()
                .status(HttpStatus.CREATED.value())
                .message("Usuario registrado exitosamente")
                .success(true)
                .timestamp(LocalDateTime.now())
                .build();
        return apiResponse;
    }
}
