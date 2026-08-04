import api from "./api";

const DASHBOARD_URL = "/admin/dashboard";

export const getAdminDashboardSummary = async () => {
    const response = await api.get(`${DASHBOARD_URL}/summary`);
    return response.data;
};