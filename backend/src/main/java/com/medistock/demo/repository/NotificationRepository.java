package com.medistock.demo.repository;


import com.medistock.demo.entity.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface NotificationRepository
        extends JpaRepository<Notification, Long> {


    // =====================================
    // GET ALL
    // =====================================

    List<Notification> findAllByOrderByCreatedAtDesc();


    // =====================================
    // GET UNREAD
    // =====================================

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();


    List<Notification> findByIsReadFalse();


    // =====================================
    // COUNT UNREAD
    // =====================================

    long countByIsReadFalse();


    // =====================================
    // DUPLICATE METHODS
    // =====================================

    boolean existsByTitleAndMessage(

            String title,

            String message

    );


    Optional<Notification> findByTitleAndMessage(

            String title,

            String message

    );


    // =====================================
    // TYPE
    // =====================================

    List<Notification>
    findByNotificationTypeOrderByCreatedAtDesc(

            String notificationType

    );


    List<Notification> findByNotificationType(

            String notificationType

    );


    long countByNotificationType(

            String notificationType

    );


    void deleteByNotificationType(

            String notificationType

    );


    // =====================================
    // USER
    // =====================================

    List<Notification>
    findByUserIdOrderByCreatedAtDesc(

            Long userId

    );


    List<Notification> findByUserId(

            Long userId

    );


    // =====================================
    // ROLE
    // =====================================

    List<Notification>
    findByReceiverRoleOrderByCreatedAtDesc(

            String receiverRole

    );


    List<Notification>
    findByReceiverRoleAndIsReadFalseOrderByCreatedAtDesc(

            String receiverRole

    );


    long countByReceiverRoleAndIsReadFalse(

            String receiverRole

    );


    // =====================================
    // DELETE BY MEDICINE
    // =====================================

    void deleteByMessageContaining(

            String medicineName

    );

}