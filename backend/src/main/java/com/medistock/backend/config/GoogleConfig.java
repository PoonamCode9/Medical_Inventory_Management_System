package com.medistock.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleConfig {

    @Value("${google.client-id}")
    private String clientId;

    @Bean
    public String googleClientId() {
        return clientId;
    }
}