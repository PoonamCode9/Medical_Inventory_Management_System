package com.medistock.backend.repository;

import com.medistock.backend.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    boolean existsByMedicineIdAndSentDateAndType(
            Long medicineId, LocalDate sentDate, NotificationLog.Type type);
}
