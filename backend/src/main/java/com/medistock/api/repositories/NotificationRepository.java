package com.medistock.api.repositories;

import com.medistock.api.models.Notification;
import com.medistock.api.models.NotificationStatus;
import com.medistock.api.models.NotificationType;
import com.medistock.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    long countByUserAndStatus(User user, NotificationStatus status);

    @Modifying
    @Query("UPDATE Notification n SET n.status = :status WHERE n.user = :user")
    void updateStatusForAllUserNotifications(@Param("user") User user,
                                             @Param("status") NotificationStatus status);

    /**
     * Deduplication check: was a notification of this type already sent for this medicine today?
     */
    @Query("SELECT COUNT(n) > 0 FROM Notification n " +
           "WHERE n.user = :user AND n.type = :type AND n.message LIKE :messagePattern " +
           "AND n.createdAt >= :since")
    boolean existsRecentNotification(@Param("user") User user,
                                     @Param("type") NotificationType type,
                                     @Param("messagePattern") String messagePattern,
                                     @Param("since") LocalDateTime since);
}
