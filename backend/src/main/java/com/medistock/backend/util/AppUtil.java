package com.medistock.backend.util;

public final class AppUtil {

    private AppUtil() {}

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
