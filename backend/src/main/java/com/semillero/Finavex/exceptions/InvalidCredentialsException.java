package com.semillero.Finavex.exceptions;
/**
 * Excepción lanzada cuando las credenciales de inicio de sesión son inválidas
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}
