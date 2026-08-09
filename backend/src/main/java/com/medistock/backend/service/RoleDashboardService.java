package com.medistock.backend.service;

import java.util.Map;

/**
 * Builds the full response shape each frontend dashboard page expects,
 * as a Map (matching the style the existing DashboardController already
 * uses) rather than a rigid DTO, since Admin/Pharmacist/Staff each need
 * a different set of fields.
 */
public interface RoleDashboardService {

    Map<String, Object> getAdminDashboard();

    Map<String, Object> getPharmacistDashboard(Integer userId);

    Map<String, Object> getStaffDashboard();

}