package com.medistock.backend.repository;

import com.medistock.backend.entity.Notification;
import com.medistock.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    void deleteByIsReadTrueAndUser(User user);
    void deleteByIsReadTrueAndUserIsNull();

    @Query("SELECT n FROM Notification n WHERE (n.user = :user OR n.user IS NULL) ORDER BY n.createdAt DESC")
    List<Notification> findByUserOrUserIsNullOrderByCreatedAtDesc(@Param("user") User user);

    @Query("SELECT n FROM Notification n WHERE (n.user = :user OR n.user IS NULL) AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadForUser(@Param("user") User user);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.user = :user OR n.user IS NULL) AND n.isRead = false")
    long countUnreadForUser(@Param("user") User user);

    @Query("SELECT n FROM Notification n WHERE (n.user = :user OR n.user IS NULL) AND (:type IS NULL OR n.type = :type) AND (:isRead IS NULL OR n.isRead = :isRead) ORDER BY n.createdAt DESC")
    List<Notification> filterNotifications(@Param("user") User user, @Param("type") String type, @Param("isRead") Boolean isRead);

    @Query("SELECT n FROM Notification n WHERE (n.user = :user OR n.user IS NULL) AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(n.message) LIKE LOWER(CONCAT('%', :query, '%'))) ORDER BY n.createdAt DESC")
    List<Notification> searchNotifications(@Param("user") User user, @Param("query") String query);
}
