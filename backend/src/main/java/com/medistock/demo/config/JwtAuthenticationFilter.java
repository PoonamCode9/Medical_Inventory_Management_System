package com.medistock.demo.config;

import com.medistock.demo.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;


/**
 * ============================================================
 * JWT AUTHENTICATION FILTER
 * ============================================================
 *
 * Reads the JWT token from:
 *
 * Authorization: Bearer <token>
 *
 * Extracts:
 *
 * email
 * role
 *
 * Then creates:
 *
 * ROLE_ADMIN
 * ROLE_PHARMACIST
 * ROLE_STAFF
 *
 * for Spring Security.
 *
 * ============================================================
 */
@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtService jwtService;


    public JwtAuthenticationFilter(
            JwtService jwtService
    ) {

        this.jwtService = jwtService;

    }


    @Override
    protected void doFilterInternal(

            HttpServletRequest request,

            HttpServletResponse response,

            FilterChain filterChain

    ) throws ServletException, IOException {


        // ====================================================
        // GET AUTHORIZATION HEADER
        // ====================================================

        String authHeader =
                request.getHeader("Authorization");


        String token = null;

        String email = null;

        String role = null;


        // ====================================================
        // CHECK BEARER TOKEN
        // ====================================================

        if (
                authHeader != null
                        &&
                authHeader.startsWith("Bearer ")
        ) {


            token =
                    authHeader.substring(7).trim();


            try {


                // ====================================================
                // EXTRACT EMAIL
                // ====================================================

                email =
                        jwtService.extractEmail(token);


                // ====================================================
                // EXTRACT ROLE
                // ====================================================

                role =
                        jwtService.extractRole(token);


                // ====================================================
                // CHECK VALUES
                // ====================================================

                if (
                        email != null
                                &&
                        !email.isBlank()
                                &&
                        role != null
                                &&
                        !role.isBlank()
                ) {


                    role =
                            role.trim()
                                    .toUpperCase();


                    // ====================================================
                    // CHECK IF USER IS ALREADY AUTHENTICATED
                    // ====================================================

                    if (
                            SecurityContextHolder
                                    .getContext()
                                    .getAuthentication()
                                    == null
                    ) {


                        // ====================================================
                        // SPRING SECURITY ROLE
                        // ====================================================

                        String authority =
                                "ROLE_" + role;


                        System.out.println(
                                "JWT USER  : " + email
                        );


                        System.out.println(
                                "JWT ROLE  : " + authority
                        );


                        // ====================================================
                        // CREATE AUTHENTICATION
                        // ====================================================

                        UsernamePasswordAuthenticationToken authentication =

                                new UsernamePasswordAuthenticationToken(

                                        email,

                                        null,

                                        Collections.singletonList(

                                                new SimpleGrantedAuthority(
                                                        authority
                                                )

                                        )

                                );


                        // ====================================================
                        // SET SECURITY CONTEXT
                        // ====================================================

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(
                                        authentication
                                );

                    }

                }


            } catch (Exception e) {


                System.out.println(
                        "JWT Authentication Failed: "
                                + e.getMessage()
                );


                SecurityContextHolder
                        .clearContext();

            }

        }


        // ====================================================
        // CONTINUE FILTER CHAIN
        // ====================================================

        filterChain.doFilter(
                request,
                response
        );

    }

}