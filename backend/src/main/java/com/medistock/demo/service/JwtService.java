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


/**
 * ============================================================
 * JWT SERVICE
 * ============================================================
 */
@Service
public class JwtService {


    // ============================================================
    // SECRET KEY
    // ============================================================

    private static final String SECRET =
            "medistock_secret_key_12345678901234567890";


    // ============================================================
    // TOKEN VALIDITY
    // 24 HOURS
    // ============================================================

    private static final long TOKEN_EXPIRATION =
            24 * 60 * 60 * 1000L;



    // ============================================================
    // GET SIGNING KEY
    // ============================================================

    private Key getKey() {

        return Keys.hmacShaKeyFor(
                SECRET.getBytes(
                        StandardCharsets.UTF_8
                )
        );

    }



    // ============================================================
    // GENERATE TOKEN
    // ============================================================

    public String generateToken(
            String email,
            String role
    ) {


        Map<String, Object> claims =
                new HashMap<>();


        // Store role inside JWT

        claims.put(
                "role",
                role
        );


        Date now =
                new Date();


        Date expiration =
                new Date(
                        now.getTime()
                                +
                        TOKEN_EXPIRATION
                );


        return Jwts.builder()

                .setClaims(claims)

                .setSubject(email)

                .setIssuedAt(now)

                .setExpiration(expiration)

                .signWith(
                        getKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();

    }



    // ============================================================
    // EXTRACT EMAIL
    // ============================================================

    public String extractEmail(
            String token
    ) {

        return extractAllClaims(token)
                .getSubject();

    }



    // ============================================================
    // EXTRACT ROLE
    // ============================================================

    public String extractRole(
            String token
    ) {

        Object role =
                extractAllClaims(token)
                        .get("role");


        if (role == null) {

            return null;

        }


        return role.toString();

    }



    // ============================================================
    // VALIDATE TOKEN
    // ============================================================

    public boolean isTokenValid(
            String token,
            String email
    ) {

        try {

            String extractedEmail =
                    extractEmail(token);


            return extractedEmail.equals(email)
                    &&
                    !isTokenExpired(token);

        } catch (Exception e) {

            return false;

        }

    }



    // ============================================================
    // CHECK EXPIRATION
    // ============================================================

    private boolean isTokenExpired(
            String token
    ) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());

    }



    // ============================================================
    // EXTRACT ALL CLAIMS
    // ============================================================

    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parserBuilder()

                .setSigningKey(
                        getKey()
                )

                .build()

                .parseClaimsJws(token)

                .getBody();

    }

}