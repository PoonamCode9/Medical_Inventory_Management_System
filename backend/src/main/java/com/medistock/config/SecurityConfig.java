package com.medistock.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())

                .csrf(csrf -> csrf.disable())

                /*
                 * OAuth2 login needs a session during the login process.
                 * JWT is still used for normal API authentication.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Normal login and registration
                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login"
                        ).permitAll()

                        // Google OAuth2
                        .requestMatchers(
                                "/login/**",
                                "/oauth2/**"
                        ).permitAll()

                        // Reports
                        .requestMatchers("/api/reports/**")
                        .permitAll()

                        // Purchase orders
                        .requestMatchers("/api/purchaseorders/**")
                        .hasAnyRole("ADMIN", "PHARMACIST")

                        // Medicines, inventory, expiry and notifications
                        .requestMatchers(
                                "/api/medicines/**",
                                "/api/inventory/**",
                                "/api/expirytracking/**",
                                "/api/notifications/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PHARMACIST",
                                "STAFF"
                        )

                        .anyRequest().authenticated()
                )

                // Google OAuth2 Login
                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2LoginSuccessHandler)
                )

                .httpBasic(Customizer.withDefaults());

        // JWT authentication for normal API requests
        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}