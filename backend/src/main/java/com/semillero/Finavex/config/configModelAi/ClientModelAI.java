package com.semillero.Finavex.config.configModelAi;

import com.azure.ai.inference.ChatCompletionsClient;
import com.azure.ai.inference.ChatCompletionsClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class ClientModelAI {

    @Bean
    public ChatCompletionsClient chatCompletionsClient(){
        String key = System.getenv("API_AI_GPT");

        if(key == null || key.isEmpty()){
            log.error("Error en el token!");
            throw new IllegalStateException("El token esta vacio o nulo!");
        }

        try {
            ChatCompletionsClient client = new ChatCompletionsClientBuilder()
                    .credential(new AzureKeyCredential(key))
                    .endpoint("https://models.inference.ai.azure.com")
                    .buildClient();

            log.info("✅ ChatCompletionsClient creado exitosamente");
            return client;
        } catch (Exception e) {
            log.error("❌ Error al crear ChatCompletionsClient: {}", e.getMessage(), e);
            throw new IllegalStateException("Error al configurar el cliente de Azure AI: " + e.getMessage(), e);
        }
    }
}


