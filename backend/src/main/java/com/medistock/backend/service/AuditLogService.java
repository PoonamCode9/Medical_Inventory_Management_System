package com.medistock.backend.service;

import com.medistock.backend.model.AuditLog;
import java.util.List;

public interface AuditLogService {
    void logAction(String action, String details);
    List<AuditLog> getAllLogs();
}
