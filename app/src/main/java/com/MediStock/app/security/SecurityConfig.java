package com.MediStock.app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http

                /*
                 * Use the existing CorsConfig bean.
                 */
                .cors(cors -> {})

                /*
                 * JWT authentication is stateless,
                 * so CSRF protection is disabled.
                 */
                .csrf(csrf ->
                        csrf.disable()
                )

                /*
                 * Do not create HTTP sessions.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                /*
                 * Authorization rules.
                 */
                .authorizeHttpRequests(auth ->
                        auth

                                /*
                                 * Authentication and role
                                 * endpoints are publicly accessible.
                                 */
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/api/roles/**"
                                )
                                .permitAll()

                                /*
                                 * Allow browser CORS preflight
                                 * requests.
                                 */
                                .requestMatchers(
                                        org.springframework.http.HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()

                                /*
                                 * Everything else requires
                                 * authentication.
                                 */
                                .anyRequest()
                                .authenticated()
                )

                /*
                 * JWT filter runs before the standard
                 * username/password authentication filter.
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /*
    |--------------------------------------------------------------------------
    | Password Encoder
    |--------------------------------------------------------------------------
    */

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}