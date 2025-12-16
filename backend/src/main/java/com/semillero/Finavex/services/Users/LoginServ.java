package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.config.security.Security;
import com.semillero.Finavex.controllers.Users.Login;
import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.DtoLogin;
import com.semillero.Finavex.dto.LoginResponse;
import com.semillero.Finavex.exceptions.InvalidCredentialsException;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.services.bucked.RateLimitingService;
import com.semillero.Finavex.services.emails.EmailAlertLogin;
import com.semillero.Finavex.services.jwt.TokenProvider;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServ {
    private final UserR userRepo;
    private final Security security;
    private final RateLimitingService rateLimitingService;
    private final EmailAlertLogin emailAlertLogin;
    private final TokenProvider tokenProvider;
    @Getter
    private final java.util.concurrent.ConcurrentHashMap<String, LocalDateTime> emailAlertCache = new java.util.concurrent.ConcurrentHashMap<>();

    /**
     * Autentica un usuario con sus credenciales
     * @param dtoLogin DTO con email y contraseña
     * @return ResponseEntity con los datos del login
     * @throws UserNotFoundException si el usuario no existe
     * @throws InvalidCredentialsException si la contraseña es incorrecta
     */
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(DtoLogin dtoLogin){

        //Verificamos si el usuario ha superado el límite de intentos
        if(!rateLimitingService.tryConsume(dtoLogin.getEmail())){
            log.warn("Limite de intentos agotados para el usuario: {}", dtoLogin.getEmail());

            LocalDateTime lastSend = emailAlertCache.get(dtoLogin.getEmail());
            boolean shouldSendEmail = lastSend == null || lastSend.isBefore(LocalDateTime.now().minusMinutes(15));

            if(shouldSendEmail){
                boolean sent = emailAlertLogin.sendEmail(
                        dtoLogin.getEmail(),
                        "Alerta de seguridad FINAVEX: Usuario bloqueado",
                        "Se han superado el número máximo de intentos fallidos de inicio de sesión.\n Su cuenta ha sido bloqueada temporalmente por razones de seguridad.");

                if(sent){
                    emailAlertCache.put(dtoLogin.getEmail(), LocalDateTime.now());
                }
            }


            ApiResponse<LoginResponse> responseError = ApiResponse.<LoginResponse>builder()
                    .status(HttpStatus.LOCKED.value())
                    .message("Usuario bloqueado, intente más tarde.")
                    .success(false)
                    .timestamp(LocalDateTime.now())
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.LOCKED).body(responseError);
            //throw new InvalidCredentialsException("Usuario bloqueado, intente más tarde.");
        }

        log.info("Intento de inicio de sesión para email: {}", dtoLogin.getEmail());

        // Verificar si el usuario existe
        if(!userRepo.existsByEmail(dtoLogin.getEmail())) {
            log.warn("Email no registrado: {}", dtoLogin.getEmail());
            throw new UserNotFoundException("No existe un usuario registrado con el email: " + dtoLogin.getEmail());
        }

        // Obtener usuario de la base de datos
        User userDB = userRepo.findByEmail(dtoLogin.getEmail()).orElseThrow(() -> new UserNotFoundException("Usuerio no encontrado"));

        // Verificar contraseña
        boolean isPasswordValid = security.passwordEncoder().matches(dtoLogin.getPassword(), userDB.getPassword());

        if(!isPasswordValid) {
            log.warn("Contraseña incorrecta para usuario: {}", dtoLogin.getEmail());

            //Actualizamos el número de intentos fallidos en la base de datos
            int numberAttemptPassword = userDB.getNumberAttemptPassword() + 1;
            userDB.setNumberAttemptPassword(numberAttemptPassword);
            userRepo.save(userDB);

            if(numberAttemptPassword >= 3){
                log.error("Usuario {} bloqueado por múltiples intentos fallidos de inicio de sesión", dtoLogin.getEmail());
                ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
                        .status(HttpStatus.LOCKED.value())
                        .message("Usuario bloqueado por múltiples intentos fallidos de inicio de sesión")
                        .success(false)
                        .timestamp(LocalDateTime.now())
                        .data(null)
                        .build();
                throw new InvalidCredentialsException("Usuario bloqueado por múltiples intentos fallidos de inicio de sesión");
            } else if (numberAttemptPassword < 3) {
                log.warn("Número de intentos restantes: {}", 3 - numberAttemptPassword);
                ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
                        .status(HttpStatus.LOCKED.value())
                        .message("Número de intentos restantes: " + (3 - numberAttemptPassword))
                        .success(false)
                        .timestamp(LocalDateTime.now())
                        .data(null)
                        .build();
            }
            throw new InvalidCredentialsException("La contraseña ingresada es incorrecta");
        }

        // Maps to DtoLogin
        DtoLogin dtoUserDBJwt = new DtoLogin();
        Long userId = (userDB.getId());
        dtoUserDBJwt.setId(Optional.of(userId));
        dtoUserDBJwt.setEmail(userDB.getEmail());
        dtoUserDBJwt.setPassword(userDB.getPassword());

        // Generate token
        String token = tokenProvider.generateToken(dtoUserDBJwt);

        // Construir respuesta de login exitoso
        LoginResponse loginResponse = LoginResponse.builder()
                .userId(userDB.getId())
                .email(userDB.getEmail())
                .name(userDB.getName())
                .token(token)
                .build();

        // Reset number of failed attempts
        Integer numberAttemptPassword = 0;
        userDB.setNumberAttemptPassword(numberAttemptPassword);
        userRepo.save(userDB);

        log.info("Inicio de sesión exitoso para usuario: {}", dtoLogin.getEmail());

        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Inicio de sesión exitoso")
                .success(true)
                .timestamp(LocalDateTime.now())
                .data(loginResponse)
                .build();

        return ResponseEntity.ok().body(apiResponse);
    }
}