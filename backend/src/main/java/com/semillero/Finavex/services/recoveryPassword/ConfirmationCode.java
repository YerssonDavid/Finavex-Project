package com.semillero.Finavex.services.recoveryPassword;

import com.semillero.Finavex.dto.ResponseComparisonCode;
import com.semillero.Finavex.services.emails.codeRecoverPassword.CodeExpirationEntry;
import com.semillero.Finavex.services.emails.codeRecoverPassword.EmailSendCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.security.CodeSigner;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfirmationCode {
    private final EmailSendCode emailSendCode;

    //Get code by email from Map of EmailSendCode
    public CodeExpirationEntry getCode(String email){
        CodeExpirationEntry codeMap = emailSendCode.getCodeRecoveryPassword().get(email);
        //The key is the email, get the code by email
        if(codeMap == null){
            log.warn("No se encontro ningún código para el email: {}", email);
        }
        return codeMap;
    }

    public ResponseEntity<ResponseComparisonCode> comparisonCode (String email, Long codeInput) {
        if(getCode(email) == null || getCode(email).isExpired(LocalDateTime.now())){
            ResponseComparisonCode responseError = ResponseComparisonCode.builder()
                    .message("No se encontró ningún código para el email proporcionado.")
                    .success(false)
                    .build();
            return ResponseEntity.badRequest().body(responseError);
        }
        else if(codeInput.equals(getCode(email).getCodeVerification()) && !getCode(email).isExpired(LocalDateTime.now())) {
            ResponseComparisonCode response = ResponseComparisonCode.builder()
                    .message("Código de recuperación verificado exitosamente.")
                    .success(true)
                    .build();
            return ResponseEntity.ok(response);
        } else {
            ResponseComparisonCode responseError = ResponseComparisonCode.builder()
                    .message("Codigo de recuperación invalido!")
                    .success(false)
                    .build();
            return ResponseEntity.badRequest().body(responseError);
        }
    }
}
