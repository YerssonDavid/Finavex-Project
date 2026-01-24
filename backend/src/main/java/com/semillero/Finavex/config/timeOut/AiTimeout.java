package com.semillero.Finavex.config.timeOut;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@ConfigurationProperties(prefix = "ai.timeout")
@Getter
@Setter
public class AiTimeout {
    private Duration execution;
}
