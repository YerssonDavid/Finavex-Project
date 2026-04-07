package com.semillero.Finavex.auth;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.DtoLogin;
import com.semillero.Finavex.dto.LoginResponse;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.services.auth.LoginServ;
import com.semillero.Finavex.services.bucked.RateLimitingService;
import com.semillero.Finavex.config.security.Security;
import com.semillero.Finavex.services.jwt.TokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class LoginControllerServTest {

    // 1. Mocks de TODAS las dependencias que inyecta LoginServ (esto evita NullPointerExceptions)
    @Mock
    private UserR userRepo;

    @Mock
    private RateLimitingService rateLimitingService;

    @Mock
    private Security security;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenProvider tokenProvider;

    // 2. Instancia real que vamos a probar, inyectando los Mocks automáticamente
    @InjectMocks
    private LoginServ loginServ;

    @Test
    void givingValidCredentials_whenLoginUser_thenReturnSuccessResponse() {
        // PASO 1: PREPARACIÓN (GIVEN/ARRANGE)
        String userEmail = "test@gmail.com";
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123";
        String generatedToken = "jwt-token-ey123456";

        // Creamos nuestro DTO de entrada (lo que enviaría el frontend)
        DtoLogin dtoLogin = new DtoLogin();
        dtoLogin.setEmail(userEmail);
        dtoLogin.setPassword(rawPassword);

        // Creamos la entidad simulada que devolverá la base de datos
        User userDB = User.builder()
                .id(1L)
                .name("John")
                .email(userEmail)
                .password(encodedPassword)
                .build();

        // Configuramos el comportamiento esperado de los Mocks
        // a) El servicio de límite de intentos debe permitir el acceso
        given(rateLimitingService.tryConsume(userEmail)).willReturn(true);
        // b) El repositorio debe confirmar que el email existe
        given(userRepo.existsByEmail(userEmail)).willReturn(true);
        // c) El repositorio debe devolver el usuario de la DB
        given(userRepo.findByEmail(userEmail)).willReturn(Optional.of(userDB));

        // d) Configuramos las dependencias de seguridad para la validación de contraseña
        given(security.passwordEncoder()).willReturn(passwordEncoder);
        given(passwordEncoder.matches(rawPassword, encodedPassword)).willReturn(true);

        // e) El proveedor de tokens debe generar un token válido
        given(tokenProvider.generateToken(any(DtoLogin.class))).willReturn(generatedToken);

        // PASO 2: EJECUCIÓN (WHEN/ACT)
        ApiResponse<?> result = loginServ.loginUser(dtoLogin);

        // PASO 3: VERIFICACIÓN (THEN/ASSERT)
        // Comprobamos que el resultado no es nulo y es exitoso
        assertNotNull(result, "La respuesta no debería ser nula");
        assertTrue(result.success(), "El inicio de sesión debería ser exitoso");
        assertEquals(200, result.status(), "El status HTTP debe ser 200 OK");
        assertEquals("Inicio de sesión exitoso", result.message());

        // Verificamos el contenido de la data (LoginResponse)
        LoginResponse loginResponse = (LoginResponse) result.data();
        assertNotNull(loginResponse, "Los datos de usuario no deben ser nulos");
        assertEquals(1L, loginResponse.userId());
        assertEquals(userEmail, loginResponse.email());
        assertEquals("John", loginResponse.name());
        assertEquals(generatedToken, loginResponse.token());

        // Verificamos que los mocks fueron efectivamente llamados durante la ejecución
        verify(rateLimitingService).tryConsume(userEmail);
        verify(userRepo).existsByEmail(userEmail);
        verify(userRepo).findByEmail(userEmail);
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
        verify(tokenProvider).generateToken(any(DtoLogin.class));
    }
}
