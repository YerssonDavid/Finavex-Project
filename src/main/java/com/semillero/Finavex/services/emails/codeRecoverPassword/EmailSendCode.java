package com.semillero.Finavex.services.emails.senCodeRecoverPassword;


import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.ResponseCodePassword;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSendCode {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    // Method to send recovery password email with code
    public ResponseEntity<ResponseCodePassword> sendEmailCodeRecoverPassword(String to, String subject, String text) {
        try {
            log.info("Intentando enviar email de recuperación de contraseña a: {} con asunto: {}", to, subject);

            // Code for recovery password
            Long code = 100000L + new Random().nextLong(900000L);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text + " El código de recuperación es: " + code);

            mailSender.send(message);

            log.info("Email de recuperación de contraseña enviado exitosamente a: {}", to);

            // Build response
            ResponseCodePassword response = ResponseCodePassword.builder()
                    .code(code)
                    .message("Código de recuperación enviado exitosamente.")
                    .build();
            return ResponseEntity.ok(response);
        } catch (MailException e) {
            log.error("Error al enviar email de recuperación de contraseña a {}: {}", to, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}
