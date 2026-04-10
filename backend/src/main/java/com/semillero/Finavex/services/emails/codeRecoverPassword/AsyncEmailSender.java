package com.semillero.Finavex.services.emails.codeRecoverPassword;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AsyncEmailSender {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Async("executor")
    public void sendEmailToUser(String to, String subject, String text, Long code) {
        try {
            log.info("Thread: {}", Thread.currentThread().getName());

            log.info("Usuario encontrado!");

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text + code);

            mailSender.send(message);

            log.info("Email de recuperación de contraseña enviado exitosamente a: {}", to);
        } catch (MailException e) {
            log.error("Error al enviar email a {}: {}", to, e.getMessage(), e);
        }
    }
}
