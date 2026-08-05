package com.medicalinventory.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicalinventory.backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop5ByOrderByCreatedAtDesc();

    List<Notification> findAllByOrderByCreatedAtDesc();

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();

    List<Notification> findByIsReadFalse();

    List<Notification> findByIsReadTrue();

    long countByIsReadFalse();
}