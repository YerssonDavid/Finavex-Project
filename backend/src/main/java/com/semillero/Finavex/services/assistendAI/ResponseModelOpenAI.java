package com.semillero.Finavex.services.assistendAI;

import com.semillero.Finavex.dto.aiDto.RequestAI;
import com.semillero.Finavex.dto.aiDto.ResponseAI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Service
@RequiredArgsConstructor
public class ResponseModelOpenAI {
    private final AIClientOpenAI aiClientOpenAI;

    public ResponseAI getResponse(RequestAI question){
        try{
            ResponseAI response = aiClientOpenAI.ask(question).get(8, TimeUnit.SECONDS);
            return response;
        }catch(TimeoutException e){
            return ResponseAI.builder()
                            .response("El tiempo de respuesta ha exedido el límite. Intente más tarde.")
                            .build();
        } catch (Exception e) {
            return ResponseAI.builder()
                            .response("Ha ocurrido un error al procesar la solicitud: " + e)
                            .build();
        }
    }
}
