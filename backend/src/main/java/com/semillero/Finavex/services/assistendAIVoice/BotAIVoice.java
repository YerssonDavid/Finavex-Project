package com.semillero.Finavex.services.assistendAIVoice;

import com.semillero.Finavex.client.AzureSpeechClient;
import com.semillero.Finavex.dto.aiVoiceDto.ResponseAIVoice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BotAIVoice {

    private final AzureSpeechClient azureSpeechClient;

    public ResponseEntity<ResponseAIVoice> getTokenAIVoice() {
        try {
            log.info("Iniciando obtención de token de voz");
            String token = azureSpeechClient.getToken();
            String region = azureSpeechClient.getRegion();

            if (token == null || token.isEmpty()) {
                log.error("Token es null o vacio despues de la llamada a Azure");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            log.info("Token obtenido exitosamente, region: {}", region);
            ResponseAIVoice response = ResponseAIVoice.builder()
                    .token(token)
                    .region(region)
                    .build();
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            log.error("Error de configuracion: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            log.error("Error al obtener token de Azure: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            log.error("Error inesperado obteniendo token de voz: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
