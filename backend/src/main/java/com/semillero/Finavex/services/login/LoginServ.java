package com.semillero.Finavex.services.login;

import com.semillero.Finavex.config.security.Security;
import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.DtoLogin;
import com.semillero.Finavex.dto.LoginResponse;
import com.semillero.Finavex.exceptions.InvalidCredentialsException;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.services.bucked.RateLimitingService;
import com.semillero.Finavex.services.emails.alert.EmailAlertLogin;
import com.semillero.Finavex.services.jwt.TokenProvider;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private final AuthenticationManager authenticationManager;

    /**
     * Autentica un usuario con sus credenciales
     * @param dtoLogin DTO con email y contraseña
     * @return ResponseEntity con los datos del login
     * @throws UserNotFoundException si el usuario no existe
     * @throws InvalidCredentialsException si la contraseña es incorrecta
     */
    public ApiResponse loginUser(DtoLogin dtoLogin){
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
            throw new InvalidCredentialsException("Usuario bloqueado, intente más tarde.");
        }

        log.info("Intento de inicio de sesión para email: {}", dtoLogin.getEmail());

        // Verify if user exist by email
        if(!userRepo.existsByEmail(dtoLogin.getEmail().toLowerCase())) {
            log.warn("Email no registrado: {}", dtoLogin.getEmail());
            throw new UserNotFoundException("No existe un usuario registrado con el email: " + dtoLogin.getEmail());
        }

        // get user from database
        User userDB = userRepo.findByEmail(dtoLogin.getEmail().toLowerCase()).orElseThrow(() -> new UserNotFoundException("Usuerio no encontrado"));

        // Verify password
        boolean isPasswordValid = security.passwordEncoder().matches(dtoLogin.getPassword(), userDB.getPassword());

        if(!isPasswordValid) {
            log.warn("Contraseña incorrecta para usuario: {}", dtoLogin.getEmail());

            throw new InvalidCredentialsException("La contraseña ingresada es incorrecta");
        }

        // Maps to DtoLogin
        DtoLogin dtoUserDBJwt = new DtoLogin();
        Long userId = (userDB.getId());
        dtoUserDBJwt.setId(Optional.of(userId));
        dtoUserDBJwt.setEmail(userDB.getEmail());
        dtoUserDBJwt.setPassword(userDB.getPassword());

        //Generate rol of User
        var authorities = AuthorityUtils.createAuthorityList("ROLE_USER");

        // Generate token
        String token = tokenProvider.generateToken(dtoUserDBJwt);

        // Create object of authentication
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                dtoLogin.getEmail(),
                null,
                authorities
        );

        // Save authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // Construir respuesta de login exitoso
        LoginResponse loginResponse = LoginResponse.builder()
                .userId(userDB.getId())
                .email(userDB.getEmail())
                .name(userDB.getName())
                .token(token)
                .build();

        log.info("Inicio de sesión exitoso para usuario: {}", dtoLogin.getEmail());

        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Inicio de sesión exitoso")
                .success(true)
                .timestamp(LocalDateTime.now())
                .data(loginResponse)
                .build();
        return apiResponse;
    }
}