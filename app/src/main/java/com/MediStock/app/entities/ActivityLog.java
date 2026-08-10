package com.MediStock.app.entities;

import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @Enumerated(EnumType.STRING)
    @Column(name = "module", nullable = false)
    private ActivityModule module;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private ActivityAction action;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_name")
    private String referenceName;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "performed_by", nullable = false)
    private String performedBy;

    @Column(name = "user_role", nullable = false)
    private String userRole;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    public ActivityLog() {
    }

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }

    public ActivityModule getModule() {
        return module;
    }

    public void setModule(ActivityModule module) {
        this.module = module;
    }

    public ActivityAction getAction() {
        return action;
    }

    public void setAction(ActivityAction action) {
        this.action = action;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    public String getReferenceName() {
        return referenceName;
    }

    public void setReferenceName(String referenceName) {
        this.referenceName = referenceName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public LocalDateTime getPerformedAt() {
        return performedAt;
    }

    public void setPerformedAt(LocalDateTime performedAt) {
        this.performedAt = performedAt;
    }

}