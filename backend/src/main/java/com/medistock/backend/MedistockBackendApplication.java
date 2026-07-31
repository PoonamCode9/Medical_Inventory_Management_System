package com.medistock.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedistockBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedistockBackendApplication.class, args);
    }
}
