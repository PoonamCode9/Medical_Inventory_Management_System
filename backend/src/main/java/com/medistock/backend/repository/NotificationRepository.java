package com.medistock.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUser_UserId(Integer userId);

    List<Notification> findByUser_UserIdAndIsReadFalse(Integer userId);
    long countByIsReadFalse();
    boolean existsByUser_UserIdAndMessage(Integer userId, String message);
    Long countByUser_UserIdAndIsReadFalse(Integer userId);

}