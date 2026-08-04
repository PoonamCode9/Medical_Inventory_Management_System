import api from "./api";

export const getNotifications = async () => {

    const response = await api.get("/notifications");

    return response.data;

};

export const getNotificationById = async (
    notificationId
) => {

    const response = await api.get(
        `/notifications/${notificationId}`
    );

    return response.data;

};

export const getNotificationsByStatus = async (
    status
) => {

    const response = await api.get(
        `/notifications/status/${status}`
    );

    return response.data;

};

export const getNotificationsByAlertType = async (
    alertType
) => {

    const response = await api.get(
        `/notifications/alert/${alertType}`
    );

    return response.data;

};

export const resolveNotification = async (
    notificationId,
    resolveData
) => {

    const response = await api.put(
        `/notifications/${notificationId}/resolve`,
        resolveData
    );

    return response.data;

};

export const reviewNotification = async (
    notificationId,
    reviewData
) => {

    const response = await api.put(
        `/notifications/${notificationId}/review`,
        reviewData
    );

    return response.data;

};

export const runNotificationCheck = async () => {

    const response = await api.post(
        "/notifications/check"
    );

    return response.data;

};
