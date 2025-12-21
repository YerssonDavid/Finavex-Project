package com.semillero.Finavex.controllers.password;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.users.RecoverPassword.ComparisionCodeUser;
import com.semillero.Finavex.services.Users.ChangePassword;
import com.semillero.Finavex.services.recoveryPassword.ConfirmationCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("recover-password")
@RequiredArgsConstructor
public class RecoverPassword {
    private final ChangePassword changePassword;
    private final ConfirmationCode confirmationCode;


    // Documentation Swagger (Pending)
    @PostMapping("code")
    public ResponseEntity<?> validationCodeRecoveryPassword (@RequestBody ComparisionCodeUser comparisionCodeUser){
        return confirmationCode.comparisonCode(comparisionCodeUser.getEmail(), comparisionCodeUser.getCode());
    }

    @PostMapping
    @Operation(
            summary = "Recover password",
            description = "Endpoint to recover user password by providing the old and new passwords",
            method = "POST",
            tags = {"Password Recovery"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Old and new passwords",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = String.class)
                    ),
                    required = true

            )
    )
    public ResponseEntity<ApiResponse> recoverPassword(@RequestBody String oldPassword, String newPassword) {
        return changePassword.changePassword(oldPassword, newPassword);
    }
}
