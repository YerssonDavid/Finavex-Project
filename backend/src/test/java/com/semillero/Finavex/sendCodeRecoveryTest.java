package com.semillero.Finavex;

import com.semillero.Finavex.controllers.password.sendCodeRecovery;
import com.semillero.Finavex.services.emails.codeRecoverPassword.EmailSendCode;
import com.semillero.Finavex.services.recoveryPassword.ConfirmationCode;
import com.semillero.Finavex.services.jwt.TokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = sendCodeRecovery.class)
@ExtendWith(MockitoExtension.class)
class sendCodeRecoveryTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private EmailSendCode emailSendCode;

    @Mock
    private ConfirmationCode confirmationCode;

    @Mock
    private TokenProvider tokenProvider;

    private static final String SUBJECT = "Codigo de recuperación de contraseña FINAVEX";
    private static final String TEXT_PREFIX = "El código expirara en 10 minutos.\nEl código de recuperación es: ";

    @Test
    @DisplayName("Should return 200 OK when service returns successful ResponseEntity")
    void sendCode_success() throws Exception {
        ResponseEntity<?> successResponse = ResponseEntity.ok(Map.of("message", "Código enviado"));
        doReturn(successResponse).when(emailSendCode)
                .sendEmailCodeRecoverPassword(eq("user@example.com"), eq(SUBJECT), eq(TEXT_PREFIX));

        mockMvc.perform(post("/code-recovery/send-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"user@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Should return 400 Bad Request when service indicates failure (email not registered)")
    void sendCode_failureBadRequest() throws Exception {
        ResponseEntity<?> errorResponse = ResponseEntity.badRequest().body(Map.of("message", "El email ingresado no está registrado!"));
        doReturn(errorResponse).when(emailSendCode)
                .sendEmailCodeRecoverPassword(eq("unknown@example.com"), eq(SUBJECT), eq(TEXT_PREFIX));

        mockMvc.perform(post("/code-recovery/send-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"unknown@example.com\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Should delegate to EmailSendCode with exact subject and text constants")
    void sendCode_delegatesWithCorrectArguments() throws Exception {
        ResponseEntity<?> okResponse = ResponseEntity.ok(Map.of("message", "enviado"));
        doReturn(okResponse).when(emailSendCode)
                .sendEmailCodeRecoverPassword(any(), any(), any());

        mockMvc.perform(post("/code-recovery/send-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"User@Example.com\"}"))
                .andExpect(status().isOk());

        ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);

        verify(emailSendCode).sendEmailCodeRecoverPassword(emailCaptor.capture(), subjectCaptor.capture(), textCaptor.capture());
        assertThat(emailCaptor.getValue()).isEqualTo("user@example.com");
        assertThat(subjectCaptor.getValue()).isEqualTo(SUBJECT);
        assertThat(textCaptor.getValue()).isEqualTo(TEXT_PREFIX);
    }

    @Test
    @DisplayName("Should return 400 Bad Request when request body is missing")
    void sendCode_missingBody() throws Exception {
        mockMvc.perform(post("/code-recovery/send-code")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should not allow GET method on send-code endpoint (405)")
    void sendCode_methodNotAllowedOnGet() throws Exception {
        mockMvc.perform(get("/code-recovery/send-code"))
                .andExpect(status().isMethodNotAllowed());
    }
}
