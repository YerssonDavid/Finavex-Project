package com.semillero.Finavex.controllers.password;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.codePassword.ResponseComparisonCode;
import com.semillero.Finavex.dto.users.RecoverPassword.ChangePasswordDto;
import com.semillero.Finavex.dto.users.RecoverPassword.ComparisionCodeUser;
import com.semillero.Finavex.services.recoveryPassword.ChangePassword;
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


    @PostMapping("code-verification")
    @Operation(
            summary = "Send code for password recovery",
            description = "Endpoint for validation of the recovery code sent to the user email",
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
    public ResponseEntity<?> validationCodeRecoveryPassword (@RequestBody ComparisionCodeUser comparisionCodeUser){
        ResponseComparisonCode response = confirmationCode.comparisonCode(comparisionCodeUser.getEmail(), comparisionCodeUser.getCode());
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("reset/password")
    @Operation(
            summary = "Reset password",
            description = "Resets user password after code verification. Requires the new password.",
            method = "POST",
            tags = {"Password Recovery"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "New password details",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ChangePasswordDto.class)
                    ),
                    required = true
            ),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Password changed successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ApiResponse.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "400",
                            description = "Invalid password format"
                    )
            }
    )
    public ResponseEntity<ApiResponse> recoverPassword(@RequestBody ChangePasswordDto changePasswordDto) {
        ApiResponse response = changePassword.changePassword(changePasswordDto);
        return ResponseEntity.ok().body(response);

    }
}
