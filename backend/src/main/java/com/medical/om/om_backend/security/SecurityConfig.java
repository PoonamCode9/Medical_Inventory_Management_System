package com.medical.om.om_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Main security configuration class for configuring CORS, CSRF, endpoint protection rules,
 * session management, password encoding, and registering the JWT filter.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF because we use stateless JWTs stored on the client side
            .csrf(csrf -> csrf.disable())
            // Enable and configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Set session policy to stateless (no HTTP Session will be stored)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Configure endpoint authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow anyone to access authentication/register endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/users/**").hasAuthority("ADMIN")
                .requestMatchers("/api/admin/dashboard/stats").hasAuthority("ADMIN")
                .requestMatchers("/api/admin/medicines/**").hasAnyAuthority("ADMIN", "PHARMACIST", "STAFF")
                .requestMatchers("/api/admin/inventory/**").hasAnyAuthority("ADMIN", "PHARMACIST", "STAFF")
                .requestMatchers("/api/admin/suppliers/**").hasAnyAuthority("ADMIN", "PHARMACIST", "STAFF")
                .requestMatchers("/api/admin/sales/**").hasAnyAuthority("ADMIN", "PHARMACIST")
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                .requestMatchers("/api/pharmacy/**").hasAnyAuthority("PHARMACIST", "STAFF")
                .requestMatchers("/api/staff/**").hasAuthority("STAFF")
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            // Register our custom JWT filter before Spring's UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Password encoder to securely hash and verify user passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication manager to perform credential verification (used during login).
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Cors configuration source to define allowed origins, headers, and methods.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow Vite React frontend development server
        configuration.setAllowedOrigins(java.util.Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
