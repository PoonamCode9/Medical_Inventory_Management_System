package com.medical.om.om_backend.security;

// Spring annotation that marks this as a Spring-managed component
// so you can inject it anywhere with @Autowired or constructor injection
import org.springframework.stereotype.Component;

// Reads values from application.properties using @Value
import org.springframework.beans.factory.annotation.Value;

// JJWT library imports — this is why we added jjwt-api to pom.xml
import io.jsonwebtoken.Claims;         // Represents the payload (the data inside the token)
import io.jsonwebtoken.Jwts;           // The main builder/parser for JWT tokens
import io.jsonwebtoken.security.Keys;  // Helper to create a cryptographic signing key

import javax.crypto.SecretKey;         // The Java type for a symmetric secret key
import java.util.Date;                 // Used to set the issue time and expiry time

// @Component tells Spring: "Create one instance of this class
// and keep it ready to be injected wherever it's needed"
@Component
public class JwtUtil {

    // @Value reads "app.jwt.secret" from application.properties at startup
    // and injects it into this field automatically
    // Currently it's "SudiptoKARMAKAR" — in production use a long random string
    @Value("${app.jwt.secret}")
    private String secretString;

    // @Value reads "app.jwt.expiration" from application.properties
    // 86400000 ms = 24 hours — token expires after this time
    @Value("${app.jwt.expiration}")
    private long expiration;

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPER — Build the actual SecretKey object from the raw string
    // ─────────────────────────────────────────────────────────────────────────
    // Why a method? Because we need this key in 2 places (sign + verify)
    // and we don't want to duplicate the conversion logic
    private SecretKey getSigningKey() {
        // Keys.hmacShaKeyFor() converts the raw bytes of our secret string
        // into a proper HMAC-SHA cryptographic key that JJWT can use
        return Keys.hmacShaKeyFor(secretString.getBytes());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // METHOD 1 — generateToken()
    // Called by: AuthService, right after a successful login
    // Returns: a signed JWT string like "eyJhbGciOiJIUzI1NiJ9.eyJ..."
    // ─────────────────────────────────────────────────────────────────────────
    public String generateToken(String username, String role) {
        return Jwts.builder()
                // subject() = the "who" this token belongs to
                // username is stored here so we can extract it on every request
                .subject(username)

                // claim() adds custom key-value pairs to the payload
                // We store "role" so the filter knows what permissions the user has
                .claim("role", role)

                // issuedAt() stamps WHEN this token was created
                // new Date() = right now
                .issuedAt(new Date())

                // expiration() sets WHEN this token stops being valid
                // System.currentTimeMillis() = now in milliseconds
                // + expiration = now + 24 hours
                .expiration(new Date(System.currentTimeMillis() + expiration))

                // signWith() cryptographically signs the token with our secret key
                // This produces the 3rd part of the JWT (the signature)
                // Anyone who tampers with the payload will cause this signature to break
                .signWith(getSigningKey())

                // compact() assembles all parts and returns the final JWT string
                .compact();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPER — extractAllClaims()
    // Parses the JWT string and returns the payload (Claims object)
    // This is the step that VERIFIES the signature — if tampered, it throws an exception
    // ─────────────────────────────────────────────────────────────────────────
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                // Tell the parser which key was used to sign
                // It uses this to mathematically verify the signature
                .verifyWith(getSigningKey())
                .build()
                // parseSignedClaims() does all the heavy lifting:
                // 1. Decodes the token
                // 2. Verifies the signature
                // 3. Checks if it's expired
                // 4. Returns the payload (Claims)
                // If anything is wrong → throws an exception (caught by the filter)
                .parseSignedClaims(token)
                .getPayload();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // METHOD 2 — extractUsername()
    // Called by: JwtAuthFilter on every incoming request
    // Returns: the username stored in the token's subject field
    // ─────────────────────────────────────────────────────────────────────────
    public String extractUsername(String token) {
        // getSubject() returns whatever we put in .subject() during token creation
        // which is the username (e.g. "drsmith")
        return extractAllClaims(token).getSubject();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // METHOD 3 — isTokenValid()
    // Called by: JwtAuthFilter to decide whether to allow or reject the request
    // Returns: true if the token is genuine and not expired, false otherwise
    // ─────────────────────────────────────────────────────────────────────────
    public boolean isTokenValid(String token) {
        try {
            // extractAllClaims() will throw an exception if:
            // → the signature is invalid (token was tampered with)
            // → the token is expired
            // → the token is malformed
            // If it doesn't throw → the token is valid ✅
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            // Any exception means the token is NOT valid ❌
            // We return false and the filter will reject the request
            return false;
        }
    }
}
