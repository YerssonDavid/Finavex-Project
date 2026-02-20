package com.semillero.Finavex.exceptions;

public class ExistElement extends RuntimeException {
    public ExistElement(String message) {
        super(message);
    }

    public ExistElement(String message, Throwable cause) {
        super(message, cause);
    }
}
