package com.medicalinventory.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop5ByOrderByCreatedAtDesc();

    List<Notification> findAllByOrderByCreatedAtDesc();

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();

    List<Notification> findByIsReadFalse();

    List<Notification> findByIsReadTrue();

    long countByIsReadFalse();

    @Modifying
    @Query("UPDATE Notification n SET n.medicine = null WHERE n.medicine = :medicine")
    void unlinkMedicineFromNotifications(@Param("medicine") Medicine medicine);
}