package com.semillero.Finavex.services.emails.alert;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class EmailAlertLoginTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailAlertLogin emailAlertLogin;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailAlertLogin, "fromEmail", "test@example.com");
    }

    @Test
    void testSendEmail_Success() {
        // Arrange
        String to = "recipient@example.com";
        String subject = "Test Subject";
        String text = "Test Body";

        // Act
        boolean result = emailAlertLogin.sendEmail(to, subject, text);

        // Assert
        assertTrue(result);
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendEmail_Failure() {
        // Arrange
        String to = "recipient@example.com";
        String subject = "Test Subject";
        String text = "Test Body";

        doThrow(new MailException("Simulated error") {}).when(mailSender).send(any(SimpleMailMessage.class));

        // Act
        boolean result = emailAlertLogin.sendEmail(to, subject, text);

        // Assert
        assertFalse(result);
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
