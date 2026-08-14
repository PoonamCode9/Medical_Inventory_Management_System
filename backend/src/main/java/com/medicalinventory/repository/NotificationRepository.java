package com.medicalinventory.repository;

import com.medicalinventory.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    boolean existsByMedicineMedicineIdAndNotificationType(
            Long medicineId,
            String notificationType);
}