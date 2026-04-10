package com.semillero.Finavex.exceptions;

/**
 * Excepción lanzada cuando se intenta registrar un usuario que ya existe
 */
public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }

    public DuplicateUserException(String message, Throwable cause) {
        super(message, cause);
    }
}

