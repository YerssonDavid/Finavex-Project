package com.semillero.Finavex.controllers.password;

import com.semillero.Finavex.dto.users.RecoverPassword.SendCodeRecoveryPassword;
import com.semillero.Finavex.services.emails.codeRecoverPassword.EmailSendCode;
import com.semillero.Finavex.services.recoveryPassword.ConfirmationCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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
    @Operation(
            summary = "Send code for recovery password",
            description = "Sends a recovery code to the user's email for password reset",
            method = "POST",
            tags = {"Send recovery code"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User email to send recovery code",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = SendCodeRecoveryPassword.class)
                    ),
                    required = true
            ),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Recovery code sent successfully"
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "404",
                            description = "User not found"
                    )
            }
    )
    public ResponseEntity<?> sendCodeForEmailVerify (@RequestBody SendCodeRecoveryPassword sendCodeRecoveryPassword){
        emailSendCode.sendEmailCodeRecoverPassword(
                sendCodeRecoveryPassword.getEmail(),
                "Codigo de recuperación de contraseña FINAVEX",
                "El código expirara en 10 minutos.\nEl código de recuperación es: "
        );
        return ResponseEntity.ok().body("Código de recuperación enviado exitosamente!");
    }
}
