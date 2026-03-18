package com.semillero.Finavex.services;

import com.semillero.Finavex.dto.movementsMoney.limitExpense.RequestRegistryLimitExpense;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.LimitExpense;
import com.semillero.Finavex.exceptions.UserNotFoundException;
import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.repository.movementsR.LimitExpenseR;
import com.semillero.Finavex.services.movementsS.limitExpense.LimitExpenseRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LimitExpenseRegistryTest {

    @Mock
    private UserR userR;

    @Mock
    private LimitExpenseR limitExpenseR;

    @InjectMocks
    private LimitExpenseRegistry limitExpenseRegistry;

    @Captor
    private ArgumentCaptor<LimitExpense> limitExpenseCaptor;

    private RequestRegistryLimitExpense validRequest;
    private User user;

    @BeforeEach
    void setUp(){
        Date future = new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24); // mañana
        validRequest = new RequestRegistryLimitExpense(new BigDecimal("150.00"), future);

        user = new User();
        user.setEmail("test@example.com");
        user.setId(1L);
    }

    @Test
    void deberia_lanzar_UserNotFoundException_cuando_email_vacio(){
        String email = "";

        assertThrows(UserNotFoundException.class, () ->
                limitExpenseRegistry.registerLimitExpense(validRequest, email)
        );
    }

    @Test
    void deberia_lanzar_UserNotFoundException_cuando_userR_existsByEmail_false(){
        String email = "noexiste@example.com";
        when(userR.existsByEmail(email)).thenReturn(false);

        assertThrows(UserNotFoundException.class, () ->
                limitExpenseRegistry.registerLimitExpense(validRequest, email)
        );
    }

    @Test
    void deberia_lanzar_UserNotFoundException_cuando_findByEmail_devuelve_empty(){
        String email = "maybe@example.com";
        when(userR.existsByEmail(email)).thenReturn(true);
        when(userR.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                limitExpenseRegistry.registerLimitExpense(validRequest, email)
        );
    }

    @Test
    void deberia_registrar_limitExpense_y_devolver_ApiResponse_con_status_200(){
        String email = "test@example.com";
        when(userR.existsByEmail(email)).thenReturn(true);
        when(userR.findByEmail(email)).thenReturn(Optional.of(user));

        var response = limitExpenseRegistry.registerLimitExpense(validRequest, email);

        // Verificar que se haya guardado la entidad con los valores esperados
        verify(limitExpenseR).save(limitExpenseCaptor.capture());
        LimitExpense saved = limitExpenseCaptor.getValue();

        assertThat(saved.getIdUser()).isEqualTo(user);
        assertThat(saved.getValueLimit()).isEqualByComparingTo(new BigDecimal("150.00"));
        assertThat(saved.getExpirationDate()).isEqualTo(validRequest.expirationDateRegistry());
        assertThat(response.status()).isEqualTo(200);
        assertThat(response.success()).isTrue();
    }

    @Test
    void deberia_relanzar_UserNotFoundException_cuando_limitExpenseR_save_lanza_error(){
        String email = "test@example.com";
        when(userR.existsByEmail(email)).thenReturn(true);
        when(userR.findByEmail(email)).thenReturn(Optional.of(user));

        doThrow(new RuntimeException("DB error")).when(limitExpenseR).save(org.mockito.ArgumentMatchers.any(LimitExpense.class));

        UserNotFoundException ex = assertThrows(UserNotFoundException.class, () ->
                limitExpenseRegistry.registerLimitExpense(validRequest, email)
        );

        assertThat(ex.getMessage()).isEqualTo("Error, intenta más tarde");
    }
}
