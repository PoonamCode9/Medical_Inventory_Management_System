package com.medical.om.om_backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(
            @Value("${DB_URL:jdbc:postgresql://localhost:5432/om_medical}") String rawUrl,
            @Value("${DB_USER:postgres}") String user,
            @Value("${DB_PASSWORD:2026}") String password) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(stripCredentials(rawUrl));
        config.setUsername(user);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        return new HikariDataSource(config);
    }

    private String stripCredentials(String url) {
        if (url == null) {
            return url;
        }
        return url.replaceFirst("^(jdbc:postgresql://)[^/@]+@", "$1");
    }
}