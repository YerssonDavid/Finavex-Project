package com.semillero.Finavex.controllers.password;

import com.semillero.Finavex.dto.users.RecoverPassword.SendCodeRecoveryPassword;
import com.semillero.Finavex.services.emails.codeRecoverPassword.EmailSendCode;
import com.semillero.Finavex.services.recoveryPassword.ConfirmationCode;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("code-recovery")
@RequiredArgsConstructor
public class sendCodeRecovery {
    private final EmailSendCode emailSendCode;
    private final ConfirmationCode confirmationCode;

    // Send code recovery password to email user
    @PostMapping("send-code")
    public ResponseEntity<?> sendCodeForEmailVerify (@RequestBody SendCodeRecoveryPassword sendCodeRecoveryPassword){
        return emailSendCode.sendEmailCodeRecoverPassword(
                sendCodeRecoveryPassword.getEmail(),
                "Codigo de recuperación de contraseña FINAVEX",
                "El código expirara en 10 minutos.\nEl código de recuperación es: "
        );
    }
}
