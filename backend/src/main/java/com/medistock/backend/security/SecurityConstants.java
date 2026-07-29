package com.medistock.backend.security;

public final class SecurityConstants {
    public static final String JWT_SECRET = "medistock-secure-enterprise-jwt-signing-secret-key-32-bytes";
    public static final long JWT_EXPIRATION = 86400000L; // 24 hours in milliseconds

    private SecurityConstants() {}
}
