package com.semillero.Finavex.services.bucked;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    //Almacenamos un bucket por cada usuario (Nombre de usuario)
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket (String key) {
        return buckets.computeIfAbsent(key, this::createNewBucket);
    }

    private Bucket createNewBucket (String key) {
        //Permite 3 intentos cada 30 minutos
        Bandwidth limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(30)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public boolean tryConsume (String key){
        return resolveBucket(key).tryConsume(1);
    }

    //Reset the bucket
    public void resetBucket (String key){
        buckets.remove(key);
    }
}
