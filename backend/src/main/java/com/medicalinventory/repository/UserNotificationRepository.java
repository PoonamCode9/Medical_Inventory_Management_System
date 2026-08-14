package com.medicalinventory.repository;

import com.medicalinventory.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserNotificationRepository
        extends JpaRepository<UserNotification, Long> {

    List<UserNotification> findByUser_Id(Long id);

}