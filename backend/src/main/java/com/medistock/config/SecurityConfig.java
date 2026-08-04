package com.medistock.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

   public SecurityConfig(
        JwtAuthenticationFilter jwtAuthenticationFilter,
        OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {

    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
            .cors(Customizer.withDefaults())

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                    .requestMatchers(
                            "/api/users/register",
                            "/api/users/login"
                    ).permitAll()

                    // Google OAuth2 URLs
                    .requestMatchers("/login/**", "/oauth2/**").permitAll()

                    .requestMatchers("/api/reports/**")
.permitAll()
                    .requestMatchers("/api/purchaseorders/**")
                    .hasAnyRole("ADMIN", "PHARMACIST")

                    .requestMatchers(
                            "/api/medicines/**",
                            "/api/inventory/**",
                            "/api/expirytracking/**",
                            "/api/notifications/**"
                    )
                    .hasAnyRole("ADMIN", "PHARMACIST", "STAFF")

                    .anyRequest().authenticated())

            // Google Login
           .oauth2Login(oauth -> oauth
        .successHandler(this.oAuth2LoginSuccessHandler)
)

            .httpBasic(Customizer.withDefaults());

    http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
}