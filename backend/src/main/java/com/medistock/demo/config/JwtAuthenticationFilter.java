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



@Component
public class JwtAuthenticationFilter 
        extends OncePerRequestFilter {




    private final JwtService jwtService;




    public JwtAuthenticationFilter(
            JwtService jwtService
    ){

        this.jwtService = jwtService;

    }







    @Override
    protected void doFilterInternal(

            HttpServletRequest request,

            HttpServletResponse response,

            FilterChain filterChain

    ) throws ServletException, IOException {





        try {



            // ==================================================
            // GET TOKEN
            // ==================================================


            String authorizationHeader =
                    request.getHeader("Authorization");



            if (

                    authorizationHeader == null

                    ||

                    !authorizationHeader.startsWith("Bearer ")

            ){

                filterChain.doFilter(
                        request,
                        response
                );

                return;

            }







            String token =
                    authorizationHeader
                            .substring(7)
                            .trim();






            // ==================================================
            // EXTRACT JWT DATA
            // ==================================================


            String email =
                    jwtService.extractEmail(token);



            String role =
                    jwtService.extractRole(token);







            if (

                    email == null

                    ||

                    email.isBlank()

                    ||

                    role == null

                    ||

                    role.isBlank()

            ){

                filterChain.doFilter(
                        request,
                        response
                );

                return;

            }







            // ==================================================
            // NORMALIZE ROLE
            // ==================================================


            role =
                    role
                    .trim()
                    .toUpperCase();



            // Remove duplicate ROLE_

            if(
                    role.startsWith("ROLE_")
            ){

                role =
                    role.substring(5);

            }







            String authority = 
                    "ROLE_" + role;







            System.out.println(
                    "================================="
            );


            System.out.println(
                    "JWT EMAIL : "
                            + email
            );


            System.out.println(
                    "JWT ROLE  : "
                            + authority
            );


            System.out.println(
                    "REQUEST   : "
                            + request.getRequestURI()
            );


            System.out.println(
                    "================================="
            );









            // ==================================================
            // CREATE SECURITY CONTEXT
            // ==================================================



            if(

                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        == null

            ){



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





                SecurityContextHolder

                        .getContext()

                        .setAuthentication(
                                authentication
                        );


            }







        }

        catch(Exception e){



            System.out.println(
                    "JWT ERROR : "
                    +
                    e.getMessage()
            );



            SecurityContextHolder
                    .clearContext();


        }






        filterChain.doFilter(
                request,
                response
        );



    }



}