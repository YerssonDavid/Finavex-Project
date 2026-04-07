package com.semillero.Finavex.services.auth;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.users.registryUser.RegistryUserDto;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.services.auth.RegistryServ;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
public class RegistryServTest {
    @Mock
    private UserR userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegistryServ registryServ;
    
    User userMock = User.builder()
            .id(1L)
            .name("Andres")
            .surname("Perez")
            .secondSurname("Gomez")
            .documentNumber("1023456789")
            .dateOfBirth("1995-05-15")
            .phone("3001234567")
            .email("pepe@gmail.com")
            .password("djfjdsljfsakjda")
            .build();

    RegistryUserDto registryUserDto = new RegistryUserDto(
            "pepe",
            "Andres",
            "Perez",
            "Gomez",
            "1023456789",
            "1995-05-15",
            "3001234567",
            "pepe@example.com",
            "Password123!"
    );

    @Test
    @DisplayName("Registrar usuario exitosamente")
    void registryUser_Success(){
        //Arrange
        given(userRepository.existsByDocumentNumber(registryUserDto.documentNumber())).willReturn(false);
        given(userRepository.existsByEmail(registryUserDto.email())).willReturn(false);
        given(userRepository.existsByPhone(registryUserDto.phone())).willReturn(false);
        given(userRepository.save(any(User.class))).willReturn(userMock);

        //act
        ApiResponse<User> response = registryServ.registerUser(registryUserDto);

        //assert
        assertEquals(201, response.status());
        assertEquals("Usuario registrado exitosamente", response.message());
        assertTrue(response.success());

    }
}
