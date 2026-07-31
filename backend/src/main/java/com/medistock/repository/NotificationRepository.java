package com.medistock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medistock.entity.Notification;


public interface NotificationRepository extends JpaRepository<Notification, Long> {

}