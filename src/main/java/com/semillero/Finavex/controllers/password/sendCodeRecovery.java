package com.semillero.Finavex.controllers.password;

import com.semillero.Finavex.dto.ResponseCodePassword;
import com.semillero.Finavex.dto.ResponseComparisonCode;
import com.semillero.Finavex.services.emails.codeRecoverPassword.EmailSendCode;
import com.semillero.Finavex.services.recoveryPassword.ConfirmationCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("code-recovery")
@RequiredArgsConstructor
public class sendCodeRecovery {
    private final EmailSendCode emailSendCode;
    private final ConfirmationCode confirmationCode;

    // Send code recovery password to email user
    @PostMapping("send")
    public ResponseEntity<?> sendCodeRecoveryForEmail (String email){
        return emailSendCode.sendEmailCodeRecoverPassword(
                email,
                "Codigo de recuperación de contraseña FINAVEX",
                "El código expirara en 10 minutos.\nEl código de recuperación es: "
        );
    }
}
