package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);

    List<Notification> findTop5ByUserIdOrderByCreatedAtDesc(Integer userId);

    long countByUserIdAndIsReadFalse(Integer userId);

    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Integer userId);

    @Query("SELECT COUNT(n) > 0 FROM Notification n WHERE n.user.id = :userId " +
           "AND n.type = :type AND n.referenceId = :referenceId " +
           "AND n.createdAt >= :since")
    boolean existsByUserIdAndTypeAndReferenceIdSince(
            @Param("userId") Integer userId,
            @Param("type") String type,
            @Param("referenceId") Long referenceId,
            @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(n) > 0 FROM Notification n WHERE n.type = :type " +
           "AND n.referenceId = :referenceId AND n.createdAt >= :since")
    boolean existsByTypeAndReferenceIdAndCreatedAtAfter(
            @Param("type") String type,
            @Param("referenceId") Long referenceId,
            @Param("since") LocalDateTime since);
}
