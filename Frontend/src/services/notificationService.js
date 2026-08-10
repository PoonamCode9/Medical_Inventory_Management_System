import api from "./api";

/*
|--------------------------------------------------------------------------
| Get All Notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = async () => {

    const response = await api.get(
        "/notifications"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Notification By ID
|--------------------------------------------------------------------------
*/

export const getNotificationById = async (
    notificationId
) => {

    const response = await api.get(
        `/notifications/${notificationId}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Notifications By Status
|--------------------------------------------------------------------------
*/

export const getNotificationsByStatus = async (
    status
) => {

    const response = await api.get(
        `/notifications/status/${status}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Notifications By Alert Type
|--------------------------------------------------------------------------
*/

export const getNotificationsByAlertType = async (
    alertType
) => {

    const response = await api.get(
        `/notifications/alert/${alertType}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Review Notification
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
|
| The backend only permits ADMIN users to delete
| notifications that are already RESOLVED.
|
*/

export const deleteNotification = async (
    notificationId
) => {

    const response = await api.delete(
        `/notifications/${notificationId}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Run Notification Check
|--------------------------------------------------------------------------
|
| Only ADMIN users are authorized by the backend
| to run the notification synchronization.
|
*/

export const runNotificationCheck = async () => {

    const response = await api.post(
        "/notifications/check"
    );

    return response.data;
};