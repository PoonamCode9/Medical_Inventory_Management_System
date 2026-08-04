package com.MediStock.app.repositories;

import com.MediStock.app.entities.Inventory;
import com.MediStock.app.entities.Notification;
import com.MediStock.app.entities.User;
import com.MediStock.app.enums.AlertType;
import com.MediStock.app.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByCreatedDateDesc();

    List<Notification> findByStatusOrderByCreatedDateDesc(
            NotificationStatus status
    );

    List<Notification> findByAlertTypeOrderByCreatedDateDesc(
            AlertType alertType
    );

    List<Notification> findByResolvedBy(
            User resolvedBy
    );

    List<Notification> findByReviewedBy(
            User reviewedBy
    );

    Optional<Notification> findByInventoryAndAlertTypeAndStatus(
            Inventory inventory,
            AlertType alertType,
            NotificationStatus status
    );

    boolean existsByInventoryAndAlertTypeAndStatus(
            Inventory inventory,
            AlertType alertType,
            NotificationStatus status
    );

    List<Notification> findByInventoryAndAlertType(
            Inventory inventory,
            AlertType alertType
    );

}