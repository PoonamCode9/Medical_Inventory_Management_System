package com.MediStock.app.constants;

public final class NotificationConstants {

    private NotificationConstants() {
    }

    /*
    |--------------------------------------------------------------------------
    | Inventory Thresholds
    |--------------------------------------------------------------------------
    */

    public static final int LOW_STOCK_THRESHOLD = 10;

    public static final int EXPIRY_WARNING_DAYS = 30;

    /*
    |--------------------------------------------------------------------------
    | Notification Status
    |--------------------------------------------------------------------------
    */

    public static final String ACTIVE = "ACTIVE";

    public static final String RESOLVED = "RESOLVED";

    /*
    |--------------------------------------------------------------------------
    | Notification Colors (Frontend Reference)
    |--------------------------------------------------------------------------
    */

    public static final String LOW_STOCK_COLOR = "#1976D2";

    public static final String EXPIRING_SOON_COLOR = "#ED6C02";

    public static final String EXPIRED_COLOR = "#D32F2F";

    public static final String RESOLVED_COLOR = "#2E7D32";

}