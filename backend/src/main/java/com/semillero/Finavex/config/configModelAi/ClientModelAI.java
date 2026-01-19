package com.semillero.Finavex.config.configModelAi;

import com.azure.ai.inference.ChatCompletionsAsyncClient;
import com.azure.ai.inference.ChatCompletionsClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class ClientModelAI {

    @Bean
    public ChatCompletionsAsyncClient chatCompletionsAsyncClient(){
        String key = System.getenv("API_AI_GPT");

        if(key == null || key.isEmpty()){
            log.error("Error en el token!");
            throw new IllegalStateException("El token esta vacio o nulo!");
        }

        try {
            log.info("🔧 Configurando cliente Azure AI con endpoint: https://models.inference.ai.azure.com");
            log.info("🔑 Token configurado: {}...", key.substring(0, Math.min(10, key.length())));

            ChatCompletionsAsyncClient client = new ChatCompletionsClientBuilder()
                    .credential(new AzureKeyCredential(key))
                    .endpoint("https://models.inference.ai.azure.com")
                    .buildAsyncClient();

            log.info("✅ Cliente asíncrono de Azure AI configurado correctamente");
            return client;
        } catch (Exception e) {
            log.error("❌ Error al crear ChatCompletionsAsyncClient: {}", e.getMessage(), e);
            throw new IllegalStateException("Error al configurar el cliente de Azure AI: " + e.getMessage(), e);
        }
    }
}


