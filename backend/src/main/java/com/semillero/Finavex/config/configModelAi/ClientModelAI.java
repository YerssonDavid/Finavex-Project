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
        String token = System.getenv("API_AI_GPT");

        if(token == null || token.isEmpty()){
            log.error("❌ CRÍTICO: El token 'API_AI_GPT' no se está cargando desde Doppler");
            log.error("   Verifica que Doppler está configurado correctamente");
            log.error("   Comando: doppler run -- mvn spring-boot:run");
            throw new IllegalStateException("El token de la API AI GPT no puede estar vacio");
        }

        log.info("✅ Token de API AI GPT cargado desde Doppler");
        log.info("   Longitud: {} caracteres", token.length());
        log.debug("   Primeros 20 caracteres: {}", token.substring(0, Math.min(20, token.length())));

        try {
            ChatCompletionsClient client = new ChatCompletionsClientBuilder()
                    .credential(new AzureKeyCredential(token))
                    .endpoint("https://models.github.ai/inference")
                    .buildClient();

            log.info("✅ ChatCompletionsClient creado exitosamente");
            return client;
        } catch (Exception e) {
            log.error("❌ Error al crear ChatCompletionsClient: {}", e.getMessage(), e);
            throw new IllegalStateException("Error al configurar el cliente de Azure AI: " + e.getMessage(), e);
        }
    }
}


