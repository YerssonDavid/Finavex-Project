package com.semillero.Finavex.exceptions.globalException;

import com.semillero.Finavex.dto.exception.ErrorGeneral;
import com.semillero.Finavex.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //Exception for user duplicate
    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ErrorGeneral> duplicateUser (DuplicateUserException ex, HttpServletRequest request){
        String safePatch = HtmlUtils.htmlEscape(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErrorGeneral(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        safePatch
                )
        );
    }

    //Exception for fail in the send email (Internal Error)
    @ExceptionHandler(EmailSendException.class)
    public ResponseEntity<ErrorGeneral> emailSend (EmailSendException ex, HttpServletRequest request){
        String safePatch = HtmlUtils.htmlEscape(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ErrorGeneral(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        safePatch
                )
        );
    }

    //Exception for already exist element
    @ExceptionHandler(ExistElement.class)
    public ResponseEntity<ErrorGeneral> existElement (ExistElement ex, HttpServletRequest request){
        String patch = HtmlUtils.htmlEscape(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErrorGeneral(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        patch
                )
        );
    }

    //Exception for invalid credentials
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorGeneral> invalidCredentials (InvalidCredentialsException ex, HttpServletRequest request){
        String patch = HtmlUtils.htmlEscape(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorGeneral(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        patch
                )
        );
    }

    //Exceptions for nto exist plan
    @ExceptionHandler(PlanNotExist.class)
    public ResponseEntity<ErrorGeneral> planNotExist (PlanNotExist ex, HttpServletRequest request){
        String patch = HtmlUtils.htmlEscape(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErrorGeneral(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        patch
                )
        );
    }

    //Exception for user not found
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorGeneral> UserNotFoundException (UserNotFoundException ex, HttpServletRequest request){
        String patch = HtmlUtils.htmlEscape(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorGeneral(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        patch
                )
        );
    }
}
