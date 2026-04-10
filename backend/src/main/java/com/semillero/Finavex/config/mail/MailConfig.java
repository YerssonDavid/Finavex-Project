package com.semillero.Finavex.config.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * Configuración específica para Brevo (SendinBlue) SMTP
 * Desactiva auto-configuración de Spring Boot y fuerza el uso de esta configuración
 */

@Slf4j
@Configuration
@EnableAutoConfiguration(exclude = {MailSenderAutoConfiguration.class})
public class MailConfig {

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private Integer mailPort;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @Bean
    @Primary
    public JavaMailSender javaMailSender() {
        log.info("🔧 Configurando JavaMailSender PERSONALIZADO para Brevo...");

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        Properties props = mailSender.getJavaMailProperties();

        // Configuración básica SMTP
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");

        // 🔥 SOLUCIÓN CRÍTICA PARA EL ERROR SSL DE BREVO
        props.put("mail.smtp.ssl.trust", "*");  // Confía en todos los certificados (solo para desarrollo)
        props.put("mail.smtp.ssl.checkserveridentity", "false");  // Desactiva verificación de identidad
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");

        // Timeouts
        props.put("mail.smtp.connectiontimeout", "15000");
        props.put("mail.smtp.timeout", "15000");
        props.put("mail.smtp.writetimeout", "15000");

        // Debug detallado
        props.put("mail.debug", "true");

        log.info("✅ JavaMailSender configurado - Host: {}, Port: {}, Username: {}",
                mailHost, mailPort, mailUsername);

        return mailSender;
    }
}
