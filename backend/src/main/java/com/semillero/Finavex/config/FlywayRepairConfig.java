package com.semillero.Finavex.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayRepairConfig {
    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            // Repair corrige los checksums si los archivos de migración han cambiado
            flyway.repair();
            flyway.migrate();
        };
    }
}

