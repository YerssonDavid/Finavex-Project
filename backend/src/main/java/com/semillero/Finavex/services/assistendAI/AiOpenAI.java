package com.semillero.Finavex.services.assistendAI;

import com.semillero.Finavex.config.timeOut.AiTimeout;
import com.semillero.Finavex.dto.aiDto.RequestAI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiOpenAI {
    private final ExecutorService executor;
    private final AiTimeout aiTimeout;
    private final AIClientOpenAI aiClientOpenAI;
    private final JobStore jobStore;

    public void processAsync(String jobId, RequestAI question) {
        log.info("🔵 Iniciando proceso asíncrono para jobId: {}", jobId);
        jobStore.markPending(jobId);
        log.info("✅ JobId marcado como PENDING: {}", jobId);

        log.info("🚀 Ejecutando tarea asíncrona para jobId: {}", jobId);
        aiClientOpenAI.ask(question)
                .subscribe(
                        aiResponse -> {
                            log.info("📥 Respuesta recibida del Mono para jobId: {}", jobId);
                            jobStore.saveResult(jobId, aiResponse);
                            log.info("✅ Respuesta guardada en JobStore para jobId: {}", jobId);
                        },
                        error -> {
                            log.error("❌ Error en el Mono para jobId {}: {}", jobId, error.getMessage());
                            jobStore.saveError(jobId, "Error: " + error.getMessage());
                        },
                        () -> log.info("📤 Mono completado para jobId: {}", jobId)
                );

        log.info("📤 Subscribe enviado para jobId: {}", jobId);
    }
}