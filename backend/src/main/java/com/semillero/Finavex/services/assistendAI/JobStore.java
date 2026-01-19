package com.semillero.Finavex.services.assistendAI;

import com.semillero.Finavex.dto.aiDto.JobTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class JobStore {
    private static final Long MAX_AGE_MILLIS = TimeUnit.MINUTES.toMillis(2);
    private final Map<String, JobTime> store = new ConcurrentHashMap<>();


    public void markPending(String jobId) {
        store.put(jobId, new JobTime("PENDING", System.currentTimeMillis()));
        log.info("📝 JobId {} marcado como PENDING. Total jobs en store: {}", jobId, store.size());
    }

    public boolean saveResult(String jobId, Object result) {
        store.put(jobId, new JobTime(result, System.currentTimeMillis()));
        boolean exists = store.containsKey(jobId);
        log.info("💾 Resultado guardado para jobId {}. Existe en store: {}. Tipo: {}. Total jobs: {}",
                jobId, exists, result.getClass().getSimpleName(), store.size());
        return exists;
    }

    public void saveError(String jobId, String errorMessage) {
        store.put(jobId, new JobTime(errorMessage, System.currentTimeMillis()));
        log.error("❌ Error guardado para jobId {}: {}. Total jobs: {}", jobId, errorMessage, store.size());
    }

    private boolean isExpired(JobTime time){
        return System.currentTimeMillis() - time.createdAt() > TimeUnit.MINUTES.toMillis(2);
    }

    public Object get(String jobId) {
        log.info("🔍 Buscando jobId: {}. Jobs en store: {}", jobId, store.size());
        JobTime time = store.get(jobId);

        if(time == null){
            log.warn("⚠️ JobId {} no encontrado en el store", jobId);
            return null;
        }

        if(isExpired(time)){
            log.warn("⏰ JobId {} expirado (más de 2 minutos)", jobId);
            return null;
        }

        Object value = time.value();
        log.info("✅ JobId {} encontrado. Tipo de valor: {}", jobId, value.getClass().getSimpleName());
        return value;
    }
}
