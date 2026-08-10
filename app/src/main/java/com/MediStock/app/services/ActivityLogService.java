package com.MediStock.app.services;

import com.MediStock.app.dto.ActivityLogResponse;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;

import java.time.LocalDateTime;
import java.util.List;

public interface ActivityLogService {

    void logActivity(

            ActivityModule module,

            ActivityAction action,

            Long referenceId,

            String referenceName,

            String description

    );

    List<ActivityLogResponse> getAllActivities();

    List<ActivityLogResponse> getRecentActivities();

    ActivityLogResponse getActivityById(
            Long logId
    );

    List<ActivityLogResponse> getActivitiesByModule(
            ActivityModule module
    );

    List<ActivityLogResponse> getActivitiesByAction(
            ActivityAction action
    );

    List<ActivityLogResponse> getActivitiesByUser(
            String performedBy
    );

    List<ActivityLogResponse> getActivitiesByUserRole(
            String userRole
    );

    List<ActivityLogResponse> getActivitiesBetweenDates(

            LocalDateTime startDate,

            LocalDateTime endDate

    );

    List<ActivityLogResponse> getActivitiesByModuleAndDate(

            ActivityModule module,

            LocalDateTime startDate,

            LocalDateTime endDate

    );

}