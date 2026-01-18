package com.semillero.Finavex.services.emails.codeRecoverPassword;


import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.codePassword.ResponseCodePassword;
import com.semillero.Finavex.repository.UserR;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
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
    private final AsyncEmailSender asyncEmailSender;

    @Getter
    public final java.util.concurrent.ConcurrentHashMap<String, CodeExpirationEntry> codeRecoveryPassword = new java.util.concurrent.ConcurrentHashMap<>();

    @Value("${spring.mail.from}")
    private String fromEmail;

    // Method to send recovery password email with code
    public ResponseEntity<?> sendEmailCodeRecoverPassword(String to, String subject, String text) {
        try {
            log.info("Intentando enviar email de recuperación de contraseña a: {} con asunto: {}", to, subject);

            log.info(Thread.currentThread().getName());

            String normalizedEmail = to.trim().toLowerCase();

            if (userR.existsByEmail(normalizedEmail)) {
                log.info("Usuario encontrado!");

                // Generate code for recovery password
                Long code = 100000L + new Random().nextLong(900000L);

                CodeExpirationEntry codeExpirationEntry = new CodeExpirationEntry(code, LocalDateTime.now());

                // Storage code with expiration time and Email of the user
                codeRecoveryPassword.put(normalizedEmail, codeExpirationEntry);

                asyncEmailSender.sendEmailToUser(to, subject, text, code);

                log.info("Email de recuperación de contraseña enviado exitosamente a: {}", to);

                ResponseCodePassword response = new ResponseCodePassword(
                        "Código de recuperación enviado exitosamente!"
                );

                return ResponseEntity.ok(response);
            } else {
                log.warn("No se pudo enviar el email a: {}", normalizedEmail);

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
