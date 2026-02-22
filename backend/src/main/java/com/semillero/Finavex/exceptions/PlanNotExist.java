package com.semillero.Finavex.exceptions;

public class PlanNotExist extends RuntimeException {
    public PlanNotExist(String message) {
        super(message);
    }

    public PlanNotExist(String message, Throwable cause){
        super(message, cause);
    }
}
