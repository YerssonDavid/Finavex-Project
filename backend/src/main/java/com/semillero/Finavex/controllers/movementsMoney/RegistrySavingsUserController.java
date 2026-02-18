package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.exception.ErrorPlanNotExist;
import com.semillero.Finavex.dto.movementsMoney.RequestRegistrySavingsUser;
import com.semillero.Finavex.dto.movementsMoney.ResponseRegistrySavingsUser;
import com.semillero.Finavex.exceptions.PlanNotExist;
import com.semillero.Finavex.services.movementsS.RegistrySavingsUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.eclipse.jetty.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;

@RestController
@RequestMapping("registry/savings-user")
@RestControllerAdvice
@RequiredArgsConstructor
public class RegistrySavingsUserController {
    private final RegistrySavingsUser registrySavingsUser;


    @ExceptionHandler(PlanNotExist.class)
    public ResponseEntity<ErrorPlanNotExist> planNotExist (PlanNotExist ex, HttpServletRequest request){
        //Intercept petition and escape the path to prevent XSS attacks
        String safePath = HtmlUtils.htmlEscape(request.getRequestURI());

        ErrorPlanNotExist error = new ErrorPlanNotExist(
                HttpStatus.BAD_REQUEST_400,
                "Error -> " + ex.getMessage(),
                LocalDateTime.now(),
                safePath
                );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST_400).body(error);
    }

    @PostMapping
    public ResponseEntity<ResponseRegistrySavingsUser> registrySavings (@Validated @RequestBody RequestRegistrySavingsUser request){
        ResponseRegistrySavingsUser response = registrySavingsUser.registrySavingsUser(request);
        return ResponseEntity.ok(response);
    }
}
