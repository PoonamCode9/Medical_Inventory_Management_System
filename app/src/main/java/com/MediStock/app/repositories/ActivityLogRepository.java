package com.MediStock.app.repositories;

import com.MediStock.app.entities.ActivityLog;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ActivityLogRepository
        extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findAllByOrderByPerformedAtDesc();

    List<ActivityLog> findTop20ByOrderByPerformedAtDesc();

    List<ActivityLog> findByModuleOrderByPerformedAtDesc(
            ActivityModule module
    );

    List<ActivityLog> findByActionOrderByPerformedAtDesc(
            ActivityAction action
    );

    List<ActivityLog> findByPerformedByOrderByPerformedAtDesc(
            String performedBy
    );

    List<ActivityLog> findByUserRoleOrderByPerformedAtDesc(
            String userRole
    );

    List<ActivityLog> findByPerformedAtBetweenOrderByPerformedAtDesc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<ActivityLog> findByModuleAndPerformedAtBetweenOrderByPerformedAtDesc(
            ActivityModule module,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

}