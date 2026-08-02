package com.medistock.demo.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;


import org.springframework.stereotype.Service;


import java.nio.charset.StandardCharsets;

import java.security.Key;

import java.util.Date;

import java.util.HashMap;

import java.util.Map;



@Service
public class JwtService {



    // =========================================================
    // SECRET KEY
    // =========================================================


    private static final String SECRET =
            "medistock_secret_key_12345678901234567890";




    // =========================================================
    // TOKEN EXPIRY
    // 24 HOURS
    // =========================================================


    private static final long TOKEN_EXPIRATION =

            24 * 60 * 60 * 1000L;







    // =========================================================
    // SIGNING KEY
    // =========================================================


    private Key getKey(){


        return Keys.hmacShaKeyFor(

                SECRET.getBytes(
                        StandardCharsets.UTF_8
                )

        );


    }








    // =========================================================
    // GENERATE JWT TOKEN
    // =========================================================


    public String generateToken(

            String email,

            String role

    ){



        Map<String,Object> claims =
                new HashMap<>();




        // Normalize role before storing

        if(role != null){


            role =
                    role.trim()
                            .toUpperCase();



            if(role.startsWith("ROLE_")){


                role =
                    role.substring(5);

            }


        }



        claims.put(
                "role",
                role
        );





        Date issuedAt =
                new Date();




        Date expiry =

                new Date(

                        issuedAt.getTime()
                                +
                        TOKEN_EXPIRATION

                );






        return Jwts.builder()

                .setClaims(claims)

                .setSubject(email)

                .setIssuedAt(issuedAt)

                .setExpiration(expiry)

                .signWith(

                        getKey(),

                        SignatureAlgorithm.HS256

                )

                .compact();



    }








    // =========================================================
    // EXTRACT EMAIL
    // =========================================================


    public String extractEmail(

            String token

    ){


        return extractAllClaims(token)
                .getSubject();


    }








    // =========================================================
    // EXTRACT ROLE
    // =========================================================


    public String extractRole(

            String token

    ){



        Object role =

                extractAllClaims(token)
                        .get("role");



        if(role == null){

            return null;

        }



        return role.toString()
                .trim()
                .toUpperCase();



    }








    // =========================================================
    // VALIDATE TOKEN
    // =========================================================


    public boolean isTokenValid(

            String token,

            String email

    ){


        try{


            return extractEmail(token)
                    .equals(email)

                    &&

                    !isTokenExpired(token);



        }

        catch(Exception e){


            return false;


        }


    }








    // =========================================================
    // CHECK EXPIRY
    // =========================================================


    private boolean isTokenExpired(

            String token

    ){



        return extractAllClaims(token)

                .getExpiration()

                .before(
                        new Date()
                );



    }








    // =========================================================
    // READ CLAIMS
    // =========================================================


    private Claims extractAllClaims(

            String token

    ){



        return Jwts.parserBuilder()

                .setSigningKey(
                        getKey()
                )

                .build()

                .parseClaimsJws(token)

                .getBody();



    }



}