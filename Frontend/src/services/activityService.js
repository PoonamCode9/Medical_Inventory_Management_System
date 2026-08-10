import api from "./api";

const BASE_URL = "/activity-logs";

const activityService = {

    getAllActivities: async () => {

        const response = await api.get(BASE_URL);

        return response.data;

    },

    getRecentActivities: async () => {

        const response = await api.get(
            `${BASE_URL}/recent`
        );

        return response.data;

    },

    getActivityById: async (logId) => {

        const response = await api.get(
            `${BASE_URL}/${logId}`
        );

        return response.data;

    },

    getActivitiesByModule: async (module) => {

        const response = await api.get(
            `${BASE_URL}/module/${module}`
        );

        return response.data;

    },

    getActivitiesByAction: async (action) => {

        const response = await api.get(
            `${BASE_URL}/action/${action}`
        );

        return response.data;

    },

    getActivitiesByUser: async (email) => {

        const response = await api.get(
            `${BASE_URL}/user/${email}`
        );

        return response.data;

    },

    getActivitiesByRole: async (role) => {

        const response = await api.get(
            `${BASE_URL}/role/${role}`
        );

        return response.data;

    },

    getActivitiesBetweenDates: async (

        startDate,

        endDate

    ) => {

        const response = await api.get(
            `${BASE_URL}/between`,
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );

        return response.data;

    },

    getActivitiesByModuleAndDate: async (

        module,

        startDate,

        endDate

    ) => {

        const response = await api.get(
            `${BASE_URL}/module/${module}/between`,
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );

        return response.data;

    }

};

export default activityService;