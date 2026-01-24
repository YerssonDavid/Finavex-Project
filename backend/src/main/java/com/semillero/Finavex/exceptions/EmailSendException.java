package com.semillero.Finavex.exceptions;

public class EmailSendException extends RuntimeException{
    public EmailSendException (String message) {
        super(message);
    }
}
