package com.medistock.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;

    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {


        http

        // ==================================================
        // CSRF
        // ==================================================

        .csrf(
                csrf -> csrf.disable()
        )


        // ==================================================
        // CORS
        // ==================================================

        .cors(
                Customizer.withDefaults()
        )


        // ==================================================
        // SESSION
        // ==================================================

        .sessionManagement(
                session -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                )
        )


        // ==================================================
        // AUTHORIZATION
        // ==================================================

        .authorizeHttpRequests(auth -> auth


                // ==================================================
                // CORS OPTIONS
                // ==================================================

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                )
                .permitAll()


                // ==================================================
                // PUBLIC
                // ==================================================
                .requestMatchers(
        "/",
        "/error",
        "/favicon.ico",
        "/api/auth/**",
        "/api/auth/login",
        "/api/auth/register"
)
.permitAll()


                // ==================================================
                // USER PROFILE
                // ==================================================

                .requestMatchers(
                        "/api/users/profile",
                        "/api/users/change-password",
                        "/api/users/update-profile"
                )
                .authenticated()


                // ==================================================
                // ADMIN USER MANAGEMENT
                // ==================================================

                .requestMatchers(
                        "/api/users",
                        "/api/users/**"
                )
                .hasRole("ADMIN")


                // ==================================================
                // DASHBOARD
                // ADMIN + PHARMACIST + STAFF
                // ==================================================

                .requestMatchers(
                        "/api/dashboard/**"
                )
                .hasAnyRole(
                        "ADMIN",
                        "PHARMACIST",
                        "STAFF"
                )


                // ==================================================
                // VIEW MEDICINES
                // ADMIN + PHARMACIST + STAFF
                // ==================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/medicines/**"
                )
                .hasAnyRole(
                        "ADMIN",
                        "PHARMACIST",
                        "STAFF"
                )


                // ==================================================
                // ADD / EDIT / DELETE MEDICINES
                // ADMIN ONLY
                // ==================================================

                .requestMatchers(
                        "/api/medicines/**"
                )
                .hasRole("ADMIN")


                // ==================================================
                // NOTIFICATIONS
                // ADMIN + PHARMACIST + STAFF
                // ==================================================

                .requestMatchers(
                        "/api/notifications/**"
                )
                .hasAnyRole(
                        "ADMIN",
                        "PHARMACIST",
                        "STAFF"
                )


                // ==================================================
                // ADMIN MODULES
                // ==================================================

                .requestMatchers(
                        "/api/suppliers/**",
                        "/api/stock-logs/**",
                        "/api/stock-alerts/**",
                        "/api/expiry/**",
                        "/api/analytics/**",
                        "/api/reports/**",
                        "/api/purchase-orders/**"
                )
                .hasRole("ADMIN")


                // ==================================================
                // SALES
                // ADMIN + PHARMACIST
                // ==================================================

                .requestMatchers(
                        "/api/sales/**"
                )
                .hasAnyRole(
                        "ADMIN",
                        "PHARMACIST"
                )


                // ==================================================
                // PHARMACIST MODULES
                // ==================================================

                .requestMatchers(
                        "/api/pharmacist/**"
                )
                .hasRole("PHARMACIST")


                // ==================================================
                // ADMIN STOCK UPDATE
                //
                // IMPORTANT:
                // This must come BEFORE /api/staff/**
                // ==================================================

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/staff/stock/update/**"
                )
                .hasRole("ADMIN")


                // ==================================================
                // STAFF MODULES
                //
                // STAFF CAN ACCESS STAFF APIs
                // BUT STOCK UPDATE ABOVE IS ADMIN ONLY
                // ==================================================

                .requestMatchers(
                        "/api/staff/**"
                )
                .hasRole("STAFF")


                // ==================================================
                // EVERYTHING ELSE
                // ==================================================

                .anyRequest()
                .authenticated()

        )


        // ==================================================
        // DISABLE DEFAULT LOGIN
        // ==================================================

        .formLogin(
                form -> form.disable()
        )


        .httpBasic(
                basic -> basic.disable()
        );


        // ==================================================
        // JWT FILTER
        // ==================================================

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );


        return http.build();

    }


    // ==================================================
    // PASSWORD ENCODER
    // ==================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

}