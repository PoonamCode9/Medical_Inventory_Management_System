package com.MediStock.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtGenerator {

    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public String generateToken(String email, String role) {

        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + 86400000);
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key)
                .compact();
    }
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String extractEmail(String token) {

        return extractClaims(token).getSubject();
    }
    public String extractRole(String token) {

        return extractClaims(token).get("role", String.class);
    }
    public boolean validateToken(String token) {

        try {
            Claims claims = extractClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
    public Key getSigningKey() {
        return key;
    }
}