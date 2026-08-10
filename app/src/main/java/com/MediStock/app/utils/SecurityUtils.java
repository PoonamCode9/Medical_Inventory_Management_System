package com.MediStock.app.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return "SYSTEM";

        }

        return authentication.getName();

    }

    public static String getCurrentUserRole() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return "SYSTEM";

        }

        return authentication
                .getAuthorities()
                .stream()
                .findFirst()
                .map(authority -> authority
                        .getAuthority()
                        .replace("ROLE_", ""))
                .orElse("UNKNOWN");

    }

}