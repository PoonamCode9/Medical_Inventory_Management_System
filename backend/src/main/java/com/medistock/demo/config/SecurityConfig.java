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
    ){

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;

    }






    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http

    ) throws Exception {


        http


        // ================================
        // CSRF
        // ================================

        .csrf(
                csrf -> csrf.disable()
        )



        // ================================
        // CORS
        // ================================

        .cors(
                Customizer.withDefaults()
        )



        // ================================
        // SESSION
        // ================================

        .sessionManagement(

                session -> session

                .sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                )

        )



        // ================================
        // AUTHORIZATION
        // ================================

        .authorizeHttpRequests(auth -> auth



                // OPTIONS REQUEST

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                )
                .permitAll()





                // =========================
                // PUBLIC APIs
                // =========================

                .requestMatchers(

                        "/",
                        "/error",
                        "/api/auth/**"

                )
                .permitAll()





                // =========================
                // DASHBOARD
                // =========================

                .requestMatchers(
                        "/api/dashboard/**"
                )
                .hasAnyRole(
                        "ADMIN",
                        "PHARMACIST",
                        "STAFF"
                )






                // =========================
                // USER PROFILE
                // =========================

                .requestMatchers(

                        "/api/users/profile",
                        "/api/users/update-profile",
                        "/api/users/change-password"

                )
                .authenticated()






                // =========================
                // USER MANAGEMENT
                // ADMIN
                // =========================

                .requestMatchers(
                        "/api/users/**"
                )
                .hasRole("ADMIN")







                // =========================
                // MEDICINES VIEW
                // =========================

                .requestMatchers(

                        HttpMethod.GET,
                        "/api/medicines/**"

                )
                .hasAnyRole(

                        "ADMIN",
                        "PHARMACIST",
                        "STAFF"

                )






                // =========================
                // MEDICINE CRUD
                // ADMIN
                // =========================

                .requestMatchers(

                        "/api/medicines/**"

                )
                .hasRole("ADMIN")







                // =========================
                // SUPPLIERS
                // ADMIN + PHARMACIST VIEW
                // =========================


                .requestMatchers(

                        HttpMethod.GET,
                        "/api/suppliers/**"

                )
                .hasAnyRole(

                        "ADMIN",
                        "PHARMACIST"

                )



                .requestMatchers(

                        "/api/suppliers/**"

                )
                .hasRole("ADMIN")







                // =========================
                // NOTIFICATIONS
                // =========================

                .requestMatchers(

                        "/api/notifications/**"

                )
                .hasAnyRole(

                        "ADMIN",
                        "PHARMACIST",
                        "STAFF"

                )






                // =========================
                // STOCK LOGS
                // =========================

                .requestMatchers(

                        "/api/stock-logs/**"

                )
                .hasRole("ADMIN")






                // =========================
                // EXPIRY
                // =========================

                .requestMatchers(

                        "/api/expiry/**"

                )
                .hasAnyRole(

                        "ADMIN",
                        "PHARMACIST"

                )







                // =========================
                // REPORTS
                // =========================

                .requestMatchers(

                        "/api/reports/**"

                )
                .hasRole("ADMIN")








                // =========================
                // SALES
                // =========================

                .requestMatchers(

                        "/api/sales/**"

                )
                .hasAnyRole(

                        "ADMIN",
                        "PHARMACIST"

                )








                // =========================
                // PHARMACIST
                // =========================

                .requestMatchers(

                        "/api/pharmacist/**"

                )
                .hasRole("PHARMACIST")









                // =========================
                // STAFF
                // =========================

                .requestMatchers(

                        "/api/staff/**"

                )
                .hasRole("STAFF")








                // =========================
                // EVERYTHING ELSE
                // =========================

                .anyRequest()
                .authenticated()



        );







        // ================================
        // DISABLE BASIC LOGIN
        // ================================


        http

        .formLogin(
                form -> form.disable()
        )


        .httpBasic(
                basic -> basic.disable()
        );







        // ================================
        // JWT FILTER
        // ================================


        http.addFilterBefore(

                jwtAuthenticationFilter,

                UsernamePasswordAuthenticationFilter.class

        );






        return http.build();

    }








    // ================================
    // PASSWORD ENCODER
    // ================================


    @Bean
    public PasswordEncoder passwordEncoder(){

        return new BCryptPasswordEncoder();

    }



}