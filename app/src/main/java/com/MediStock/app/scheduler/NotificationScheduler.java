package com.MediStock.app.scheduler;

import com.MediStock.app.services.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {

    private final NotificationService notificationService;

    public NotificationScheduler(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    /*
    |--------------------------------------------------------------------------
    | Daily Automatic Check (8:00 AM)
    |--------------------------------------------------------------------------
    */

    @Scheduled(cron = "0 0 8 * * *")
    public void scheduledNotificationCheck() {

        runNotificationCheck();

    }

    /*
    |--------------------------------------------------------------------------
    | Main Notification Check
    |--------------------------------------------------------------------------
    */

    public void runNotificationCheck() {

        try {

            notificationService.synchronizeNotifications();

        } catch (Exception ex) {

            System.err.println(
                    "\n===================================="
            );

            System.err.println(
                    "Notification Scheduler Failed"
            );

            ex.printStackTrace();

            System.err.println(
                    "====================================\n"
            );

        }

    }

}
