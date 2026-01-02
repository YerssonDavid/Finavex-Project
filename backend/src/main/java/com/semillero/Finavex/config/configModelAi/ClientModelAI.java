package com.semillero.Finavex.infraestructure.infraestructureAI;

import com.azure.ai.inference.ChatCompletionsClient;
import com.azure.ai.inference.ChatCompletionsClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ClientModelAI {

    public static ChatCompletionsClient create(){
        String token = System.getenv("API_AI_GPT");

        if(token == null || token.isEmpty()){
            log.error("El token de la API AI GPT no se esta cargando!");
            throw new IllegalStateException("El token de la API AI GPT no puede estar vacio");
        }

        return new ChatCompletionsClientBuilder()
                .endpoint("https://models.github.ai/inference")
                .credential(new AzureKeyCredential(token))
                .buildClient();
    }
}
