package com.MediStock.app.services;

import com.MediStock.app.dto.ActivityLogResponse;
import com.MediStock.app.entities.ActivityLog;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import com.MediStock.app.repositories.ActivityLogRepository;
import com.MediStock.app.utils.SecurityUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogServiceImpl(
            ActivityLogRepository activityLogRepository
    ) {
        this.activityLogRepository = activityLogRepository;
    }

    @Override
    public void logActivity(

            ActivityModule module,

            ActivityAction action,

            Long referenceId,

            String referenceName,

            String description

    ) {

        ActivityLog activityLog = new ActivityLog();

        activityLog.setModule(module);

        activityLog.setAction(action);

        activityLog.setReferenceId(referenceId);

        activityLog.setReferenceName(referenceName);

        activityLog.setDescription(description);

        activityLog.setPerformedBy(
                SecurityUtils.getCurrentUserEmail()
        );

        activityLog.setUserRole(
                SecurityUtils.getCurrentUserRole()
        );

        activityLog.setPerformedAt(
                LocalDateTime.now()
        );

        activityLogRepository.save(activityLog);

    }

    @Override
    public List<ActivityLogResponse> getAllActivities() {

        return activityLogRepository
                .findAllByOrderByPerformedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<ActivityLogResponse> getRecentActivities() {

        return activityLogRepository
                .findTop20ByOrderByPerformedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public ActivityLogResponse getActivityById(
            Long logId
    ) {

        ActivityLog activityLog =
                activityLogRepository
                        .findById(logId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Activity log not found"
                                ));

        return convertToResponse(activityLog);

    }

    @Override
    public List<ActivityLogResponse> getActivitiesByModule(
            ActivityModule module
    ) {

        return activityLogRepository
                .findByModuleOrderByPerformedAtDesc(module)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<ActivityLogResponse> getActivitiesByAction(
            ActivityAction action
    ) {

        return activityLogRepository
                .findByActionOrderByPerformedAtDesc(action)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<ActivityLogResponse> getActivitiesByUser(
            String performedBy
    ) {

        return activityLogRepository
                .findByPerformedByOrderByPerformedAtDesc(performedBy)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<ActivityLogResponse> getActivitiesByUserRole(
            String userRole
    ) {

        return activityLogRepository
                .findByUserRoleOrderByPerformedAtDesc(userRole)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<ActivityLogResponse> getActivitiesBetweenDates(

            LocalDateTime startDate,

            LocalDateTime endDate

    ) {

        return activityLogRepository
                .findByPerformedAtBetweenOrderByPerformedAtDesc(
                        startDate,
                        endDate
                )
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<ActivityLogResponse> getActivitiesByModuleAndDate(

            ActivityModule module,

            LocalDateTime startDate,

            LocalDateTime endDate

    ) {

        return activityLogRepository
                .findByModuleAndPerformedAtBetweenOrderByPerformedAtDesc(
                        module,
                        startDate,
                        endDate
                )
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }

    private ActivityLogResponse convertToResponse(
            ActivityLog activityLog
    ) {

        ActivityLogResponse response =
                new ActivityLogResponse();

        response.setLogId(
                activityLog.getLogId()
        );

        response.setModule(
                activityLog.getModule().name()
        );

        response.setAction(
                activityLog.getAction().name()
        );

        response.setReferenceId(
                activityLog.getReferenceId()
        );

        response.setReferenceName(
                activityLog.getReferenceName()
        );

        response.setDescription(
                activityLog.getDescription()
        );

        response.setPerformedBy(
                activityLog.getPerformedBy()
        );

        response.setUserRole(
                activityLog.getUserRole()
        );

        response.setPerformedAt(
                activityLog.getPerformedAt()
        );

        return response;

    }

}