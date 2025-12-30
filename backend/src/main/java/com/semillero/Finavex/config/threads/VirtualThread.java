package com.semillero.Finavex.config.threads;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@Configuration
public class VirtualThread {

    @Bean
    public Executor executor(){
        return Executors.newVirtualThreadPerTaskExecutor();
    }
}
