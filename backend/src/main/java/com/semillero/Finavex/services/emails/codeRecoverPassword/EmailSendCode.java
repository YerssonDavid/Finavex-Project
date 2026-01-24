package com.semillero.Finavex.services.emails.codeRecoverPassword;

import com.semillero.Finavex.dto.codePassword.ResponseCodePassword;
import com.semillero.Finavex.exceptions.EmailSendException;
import com.semillero.Finavex.repository.UserR;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSendCode {
    private final UserR userR;
    private final AsyncEmailSender asyncEmailSender;

    @Getter
    public final java.util.concurrent.ConcurrentHashMap<String, CodeExpirationEntry> codeRecoveryPassword = new java.util.concurrent.ConcurrentHashMap<>();


    // Method to send recovery password email with code
    public ResponseCodePassword sendEmailCodeRecoverPassword(String to, String subject, String text) {
        try {
            log.info("Intentando enviar email de recuperación de contraseña a: {} con asunto: {}", to, subject);

            log.info(Thread.currentThread().getName());

            String normalizedEmail = to.trim().toLowerCase();

            if (!userR.existsByEmail(normalizedEmail)) {
                log.warn("Usuario no encontrado para email: {}", normalizedEmail);
                throw new EmailSendException("El email no está registrado en el sistema.");
            }

            log.info("Usuario encontrado!");

            // Generate code for recovery password
            Long code = 100000L + new Random().nextLong(900000L);

            CodeExpirationEntry codeExpirationEntry = new CodeExpirationEntry(code, LocalDateTime.now());

            // Storage code with expiration time and Email of the user
            codeRecoveryPassword.put(normalizedEmail, codeExpirationEntry);

            asyncEmailSender.sendEmailToUser(to, subject, text, code);

            log.info("Email de recuperación de contraseña enviado exitosamente a: {}", to);

            return new ResponseCodePassword("Código de recuperación enviado exitosamente!");
        } catch (MailException e) {
            log.error("Error al enviar email de recuperación de contraseña a {}: {}", to, e.getMessage(), e);
            throw new EmailSendException("Error al enviar el email de recuperación de contraseña.");
        } catch (Exception e) {
            log.error("Error inesperado al procesar recuperación de contraseña para {}: {}", to, e.getMessage(), e);
            throw new EmailSendException("Error inesperado: " + e.getMessage());
        }
    }
}
