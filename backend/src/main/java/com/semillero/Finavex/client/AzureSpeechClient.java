package com.semillero.Finavex.client;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;


@Component
@Slf4j
public class AzureSpeechClient {

    private final WebClient webClient;
    private final String apiKey;
    @Getter
    private final String region;

    public AzureSpeechClient(WebClient.Builder builder,
                             @Value("${azure.speech.key:}") String apiKey,
                             @Value("${azure.speech.region:}") String region) {
        this.webClient = builder.build();
        this.apiKey = apiKey;
        // Sanitizar la región: eliminar espacios y convertir a minúsculas
        this.region = (region != null) ? region.trim().toLowerCase().replace(" ", "") : "";

        log.info("AzureSpeechClient inicializado - Region: {}, ApiKey presente: {}",
                 this.region, (apiKey != null && !apiKey.isEmpty()));

        if (this.region.isEmpty()) {
            log.error("ERROR: azure.speech.region no esta configurada");
        }
        if (apiKey == null || apiKey.isEmpty()) {
            log.error("ERROR: azure.speech.key no esta configurada");
        }
    }

    public String getToken(){
        if (apiKey == null || apiKey.isEmpty()) {
            log.error("API Key de Azure no configurada");
            throw new IllegalStateException("API_KEY_AI_VOICE no esta configurada");
        }

        if (region.isEmpty()) {
            log.error("Region de Azure no configurada");
            throw new IllegalStateException("AZURE_SPEECH_REGION no esta configurada");
        }

        // Endpoint correcto para obtener token de autenticación de Azure Speech
        String url = "https://" + region + ".api.cognitive.microsoft.com/sts/v1.0/issueToken";
        log.info("Llamando a Azure Speech Token API en: {}", url);

        try {
            String token = webClient.post()
                    .uri(url)
                    .header("Ocp-Apim-Subscription-Key", apiKey)
                    .header("Content-Length", "0")
                    .retrieve()
                    .onStatus(httpStatus -> !httpStatus.is2xxSuccessful(),
                        response -> {
                            log.error("Error HTTP de Azure: {}", response.statusCode());
                            return response.createException();
                        })
                    .bodyToMono(String.class)
                    .doOnError(e -> log.error("Error en la llamada reactiva: {}", e.getMessage(), e))
                    .block();

            if (token != null && !token.isEmpty()) {
                log.info("Token obtenido exitosamente");
            } else {
                log.warn("Token retornado es vacio o null");
            }

            return token;
        } catch (Exception e) {
            log.error("Excepcion al obtener token: {}", e.getMessage(), e);
            throw new RuntimeException("Error obteniendo token de Azure: " + e.getMessage(), e);
        }
    }
}
