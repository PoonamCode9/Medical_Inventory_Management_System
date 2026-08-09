package com.medistock.backend.scheduler;

import java.lang.reflect.Field;
import java.time.LocalDate;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.medistock.backend.entity.LowStockSnapshot;
import com.medistock.backend.repository.LowStockSnapshotRepository;
import com.medistock.backend.repository.MedicineRepository;

import jakarta.annotation.PostConstruct;

/**
 * Builds real history for the "Low Stock Trend" chart, one data point per day.
 *
 * Without this, lowStockTrend has nothing to draw from — the live `Medicine`
 * table only ever holds the *current* quantity, never a history of what it
 * used to be. This writes one row per calendar day so a genuine trend can
 * accumulate over time instead of being faked.
 */
@Component
public class LowStockSnapshotScheduler {

    private static final int LOW_STOCK_THRESHOLD = 20;

    private final MedicineRepository medicineRepository;
    private final LowStockSnapshotRepository snapshotRepository;

    public LowStockSnapshotScheduler(MedicineRepository medicineRepository,
                                     LowStockSnapshotRepository snapshotRepository) {
        this.medicineRepository = medicineRepository;
        this.snapshotRepository = snapshotRepository;
    }

    // Takes one snapshot the moment the app starts, so the chart has at least
    // a single real point right away instead of staying empty for a day.
    @PostConstruct
    public void snapshotOnStartup() {
        takeSnapshot();
    }

    // Runs once a day at 00:05. Requires @EnableScheduling on the main
    // application class — see note below.
    @Scheduled(cron = "0 5 0 * * *")
    public void dailySnapshot() {
        takeSnapshot();
    }

    private void takeSnapshot() {

        long lowStockCount = medicineRepository.findAll().stream()
                .filter(m -> m.getQuantity() != null && m.getQuantity() <= LOW_STOCK_THRESHOLD)
                .count();

        LocalDate today = LocalDate.now();

        // Upsert by date so re-running (e.g. app restarts same day) doesn't
        // create duplicate rows for the same day.
        LowStockSnapshot snapshot = snapshotRepository.findBySnapshotDate(today)
                .orElseGet(LowStockSnapshot::new);

        snapshot.setSnapshotDate(today);
        snapshot.setLowStockCount((int) lowStockCount);

        snapshotRepository.save(snapshot);
    }
}