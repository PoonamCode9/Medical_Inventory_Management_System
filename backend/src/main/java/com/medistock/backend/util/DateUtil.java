package com.medistock.backend.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public final class DateUtil {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private DateUtil() {}

    public static String formatDate(LocalDate date) {
        return date == null ? null : date.format(FORMATTER);
    }
}
