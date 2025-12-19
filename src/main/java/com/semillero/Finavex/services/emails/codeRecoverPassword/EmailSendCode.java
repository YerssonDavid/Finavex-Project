package com.semillero.Finavex.services.emails.codeRecoverPassword;


import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.ResponseCodePassword;
import com.semillero.Finavex.repository.UserR;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSendCode {
    private final JavaMailSender mailSender;
    private final UserR userR;

    @Getter
    public final java.util.concurrent.ConcurrentHashMap<String, CodeExpirationEntry> codeRecoveryPassword = new java.util.concurrent.ConcurrentHashMap<>();

    @Value("${spring.mail.from}")
    private String fromEmail;

    // Method to send recovery password email with code
    public ResponseEntity<?> sendEmailCodeRecoverPassword(String to, String subject, String text) {
        try {
            log.info("Intentando enviar email de recuperación de contraseña a: {} con asunto: {}", to, subject);

            if(userR.existsByEmail(to)){
                log.info("Usuario encontrado!");

                // Generate code for recovery password
                Long code = 100000L + new Random().nextLong(900000L);

                CodeExpirationEntry codeExpirationEntry = new CodeExpirationEntry(code, LocalDateTime.now());

                // Storage code with expiration time and Email of the user
                codeRecoveryPassword.put(to, codeExpirationEntry);

                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(to);
                message.setSubject(subject);
                message.setText(text + code);

                mailSender.send(message);

                log.info("Email de recuperación de contraseña enviado exitosamente a: {}", to);

                // Build response
                ResponseCodePassword response = ResponseCodePassword.builder()
                        .code(code)
                        .message("Código de recuperación enviado exitosamente.")
                        .build();
                return ResponseEntity.ok(response);
            } else {
                log.warn("El email ingresado no está registrado");

                ApiResponse responseError = ApiResponse.builder()
                        .status(400)
                        .message("El email ingresado no está registrado!")
                        .success(false)
                        .timestamp(LocalDateTime.now())
                        .build();
                return ResponseEntity.badRequest().body(responseError);
            }
        } catch (MailException e) {
            log.error("Error al enviar email de recuperación de contraseña a {}: {}", to, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}
