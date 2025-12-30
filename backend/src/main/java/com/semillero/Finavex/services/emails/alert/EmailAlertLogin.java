package com.semillero.Finavex.services.emails.alert;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailAlertLogin {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Async("executor")
    public boolean sendEmail(String to, String subject, String text) {
        try {
            log.info("Intentando enviar email a: {} con asunto: {}", to, subject);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail); // Usar el email autenticado
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);

            log.info("Email enviado exitosamente a: {}", to);
            return true;

        } catch (MailException e) {
            log.error("Error al enviar email a {}: {}", to, e.getMessage(), e);
            return false;
            // No lanzamos la excepción para que no rompa el flujo de login
            // En un sistema de producción podrías querer almacenar esto en una cola de reintentos
        }
    }
}
