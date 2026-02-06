package com.semillero.Finavex.services.recoveryPassword;

import com.semillero.Finavex.dto.codePassword.ResponseComparisonCode;
import com.semillero.Finavex.services.emails.codeRecoverPassword.CodeExpirationEntry;
import com.semillero.Finavex.services.emails.codeRecoverPassword.EmailSendCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

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

    public ResponseComparisonCode comparisonCode (String email, Long codeInput) {
        if(getCode(email) == null || getCode(email).isExpired(LocalDateTime.now())){
            return new ResponseComparisonCode(
                    "No se encontró ningún código para el email proporcionado.",
                    false
            );
        }
        else if(codeInput.equals(getCode(email).getCodeVerification()) && !getCode(email).isExpired(LocalDateTime.now())) {
            return new ResponseComparisonCode(
                    "Código de recuperación verificado exitosamente.",
                    true
            );
        } else {
            return new ResponseComparisonCode(
                    "Codigo de recuperación invalido!",
                    false
            );
        }
    }
}
