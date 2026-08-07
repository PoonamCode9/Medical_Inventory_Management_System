package com.medistock.api.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Runs every hour to auto-generate LOW_STOCK and EXPIRY notifications.
 * Deduplication inside NotificationService prevents duplicate alerts
 * within a 23-hour window.
 */
@Component
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);

    private final NotificationService notificationService;

    public NotificationScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Runs at the top of every hour.
     * Also runs once on application startup via initialDelay = 0 (immediate first run).
     */
    @Scheduled(initialDelay = 5000, fixedRate = 3_600_000) // 5 s delay, then every 1 hour
    public void runNotificationScan() {
        log.info("[NotificationScheduler] Running expiry & low-stock notification scan...");
        try {
            notificationService.generateExpiryAndLowStockNotifications();
            log.info("[NotificationScheduler] Scan complete.");
        } catch (Exception e) {
            log.error("[NotificationScheduler] Scan failed: {}", e.getMessage(), e);
        }
    }
}
