package com.medistock.backend.service;

import com.medistock.backend.config.NotificationProperties;
import com.medistock.backend.model.Medicine;
import com.medistock.backend.model.NotificationLog;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Core of the "expiry tracker with working email notification" feature.
 *
 * Runs on a daily cron (see medistock.notification.check-cron), scans every
 * medicine's expiry date, buckets them into expired / critical / near-expiry,
 * and emails a summary — but only sends once per medicine per day, so a
 * running server doesn't spam the same alert on every restart or extra run.
 */
@Service
public class ExpiryNotificationService {

    private static final Logger log = LoggerFactory.getLogger(ExpiryNotificationService.class);

    private final MedicineRepository medicineRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final EmailService emailService;
    private final NotificationProperties props;

    public ExpiryNotificationService(MedicineRepository medicineRepository,
                                      NotificationLogRepository notificationLogRepository,
                                      EmailService emailService,
                                      NotificationProperties props) {
        this.medicineRepository = medicineRepository;
        this.notificationLogRepository = notificationLogRepository;
        this.emailService = emailService;
        this.props = props;
    }

    // ApplicationReadyEvent fires after the context is fully refreshed AND all
    // CommandLineRunners (including DataSeeder) have finished — unlike
    // @PostConstruct, which would fire too early and see an empty database.
    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        if (props.isRunOnStartup()) {
            log.info("Running an initial expiry check on startup...");
            checkExpiriesAndNotify();
        }
    }

    /** Scheduled entry point. Cron is externalised in application.yml. */
    @Scheduled(cron = "#{@notificationProperties.checkCron}")
    public void scheduledCheck() {
        checkExpiriesAndNotify();
    }

    /**
     * Runs the expiry check right now and emails a summary if there's anything
     * new to report. Returns a small result summary (used by the manual-trigger
     * REST endpoint too).
     */
    public ExpiryCheckResult checkExpiriesAndNotify() {
        LocalDate today = LocalDate.now();
        LocalDate horizon = today.plusDays(props.getNearExpiryThresholdDays());

        List<Medicine> withinHorizon = medicineRepository.findByExpiryDateLessThanEqual(horizon);

        List<Medicine> expired = new ArrayList<>();
        List<Medicine> critical = new ArrayList<>();
        List<Medicine> nearExpiry = new ArrayList<>();

        for (Medicine m : withinHorizon) {
            long daysLeft = m.getDaysToExpiry();
            NotificationLog.Type type;
            if (daysLeft < 0) {
                type = NotificationLog.Type.EXPIRED;
            } else if (daysLeft <= props.getCriticalThresholdDays()) {
                type = NotificationLog.Type.CRITICAL;
            } else {
                type = NotificationLog.Type.NEAR_EXPIRY;
            }

            // Skip medicines already notified about today, to avoid duplicate emails.
            boolean alreadySentToday = notificationLogRepository
                    .existsByMedicineIdAndSentDateAndType(m.getId(), today, type);
            if (alreadySentToday) continue;

            switch (type) {
                case EXPIRED -> expired.add(m);
                case CRITICAL -> critical.add(m);
                case NEAR_EXPIRY -> nearExpiry.add(m);
            }
        }

        int totalNew = expired.size() + critical.size() + nearExpiry.size();
        if (totalNew == 0) {
            log.info("Expiry check complete: nothing new to notify about.");
            return new ExpiryCheckResult(false, 0, 0, 0);
        }

        boolean sent = emailService.sendExpirySummary(expired, critical, nearExpiry);
        if (sent) {
            logNotified(expired, NotificationLog.Type.EXPIRED, today);
            logNotified(critical, NotificationLog.Type.CRITICAL, today);
            logNotified(nearExpiry, NotificationLog.Type.NEAR_EXPIRY, today);
        }

        return new ExpiryCheckResult(sent, expired.size(), critical.size(), nearExpiry.size());
    }

    private void logNotified(List<Medicine> medicines, NotificationLog.Type type, LocalDate today) {
        for (Medicine m : medicines) {
            notificationLogRepository.save(new NotificationLog(m.getId(), today, type));
        }
    }

    /** Simple result record returned to the manual-trigger controller. */
    public record ExpiryCheckResult(boolean emailSent, int expiredCount, int criticalCount, int nearExpiryCount) {}
}
