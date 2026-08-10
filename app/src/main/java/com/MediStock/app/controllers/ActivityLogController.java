package com.MediStock.app.controllers;

import com.MediStock.app.dto.ActivityLogResponse;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import com.MediStock.app.services.ActivityLogService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@CrossOrigin(origins = "*")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(
            ActivityLogService activityLogService
    ) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getAllActivities() {

        return activityLogService.getAllActivities();

    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getRecentActivities() {

        return activityLogService.getRecentActivities();

    }

    @GetMapping("/{logId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ActivityLogResponse getActivityById(
            @PathVariable Long logId
    ) {

        return activityLogService.getActivityById(logId);

    }

    @GetMapping("/module/{module}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getActivitiesByModule(
            @PathVariable ActivityModule module
    ) {

        return activityLogService.getActivitiesByModule(module);

    }

    @GetMapping("/action/{action}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getActivitiesByAction(
            @PathVariable ActivityAction action
    ) {

        return activityLogService.getActivitiesByAction(action);

    }

    @GetMapping("/user/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getActivitiesByUser(
            @PathVariable String email
    ) {

        return activityLogService.getActivitiesByUser(email);

    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getActivitiesByUserRole(
            @PathVariable String role
    ) {

        return activityLogService.getActivitiesByUserRole(role);

    }

    @GetMapping("/between")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getActivitiesBetweenDates(

            @RequestParam LocalDateTime startDate,

            @RequestParam LocalDateTime endDate

    ) {

        return activityLogService.getActivitiesBetweenDates(
                startDate,
                endDate
        );

    }

    @GetMapping("/module/{module}/between")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLogResponse> getActivitiesByModuleAndDate(

            @PathVariable ActivityModule module,

            @RequestParam LocalDateTime startDate,

            @RequestParam LocalDateTime endDate

    ) {

        return activityLogService.getActivitiesByModuleAndDate(
                module,
                startDate,
                endDate
        );

    }

}