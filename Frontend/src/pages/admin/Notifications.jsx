import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import {
    deleteNotification,
    getNotifications,
    runNotificationCheck
} from "../../services/notificationService";

import NotificationToolbar from "../../components/notifications/NotificationToolbar";
import NotificationSummaryCards from "../../components/notifications/NotificationSummaryCards";
import NotificationTable from "../../components/notifications/NotificationTable";
import ReviewNotificationDialog from "../../components/notifications/ReviewNotificationDialog";

function Notifications() {

    const role = localStorage.getItem("role");

    /*
     * Only Admin can manually run
     * the notification check.
     */
    const canRunCheck =
        role === "ADMIN";

    /*
     * Admin and Pharmacist can
     * review notifications.
     */
    const canManageNotifications =
        role === "ADMIN" ||
        role === "PHARMACIST";

    /*
     * Only Admin can delete
     * resolved notifications.
     */
    const canDeleteNotifications =
        role === "ADMIN";

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedAlertType, setSelectedAlertType] =
        useState("ALL");

    const [selectedStatus, setSelectedStatus] =
        useState("ALL");

    /*
     * Review dialog.
     */
    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    /*
     * Snackbar.
     */
    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    /*
     |--------------------------------------------------------------------------
     | Load Notifications
     |--------------------------------------------------------------------------
     */

    const loadNotifications =
        useCallback(async () => {

            try {

                setLoading(true);

                const data =
                    await getNotifications();

                setNotifications(data);

                setError("");

            } catch (error) {

                console.error(
                    "LOAD NOTIFICATIONS ERROR:",
                    error
                );

                setError(
                    "Unable to load notifications."
                );

            } finally {

                setLoading(false);

            }

        }, []);

    /*
     |--------------------------------------------------------------------------
     | Initial Load
     |--------------------------------------------------------------------------
     */

    useEffect(() => {

        const timer =
            setTimeout(() => {

                loadNotifications();

            }, 0);

        return () =>
            clearTimeout(timer);

    }, [loadNotifications]);

    /*
     |--------------------------------------------------------------------------
     | Run Notification Check
     |--------------------------------------------------------------------------
     */

    const handleRunCheck = async () => {

        try {

            const message =
                await runNotificationCheck();

            setSnackbarMessage(
                message
            );

            setSnackbarOpen(true);

            await loadNotifications();

        } catch (error) {

            console.error(
                "RUN NOTIFICATION CHECK ERROR:",
                error
            );

            setSnackbarMessage(
                "Failed to run notification check."
            );

            setSnackbarOpen(true);

        }

    };

    /*
     |--------------------------------------------------------------------------
     | Delete Notification
     |--------------------------------------------------------------------------
     */

    const handleDelete = async (
        notification
    ) => {

        if (!notification) {
            return;
        }

        /*
         * Only Admin can delete.
         */
        if (!canDeleteNotifications) {

            setSnackbarMessage(
                "Only administrators can delete notifications."
            );

            setSnackbarOpen(true);

            return;
        }

        /*
         * Only resolved notifications
         * can be deleted.
         */
        if (
            notification.status !==
            "RESOLVED"
        ) {

            setSnackbarMessage(
                "Only resolved notifications can be deleted."
            );

            setSnackbarOpen(true);

            return;
        }

        /*
         * Ask for confirmation before
         * permanently deleting the notification.
         */
        const confirmed =
            window.confirm(
                `Are you sure you want to delete the notification for "${notification.medicineName}" (Batch: ${notification.batchNumber})?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteNotification(
                notification.notificationId
            );

            setSnackbarMessage(
                "Notification deleted successfully."
            );

            setSnackbarOpen(true);

            /*
             * Refresh the notification list
             * after successful deletion.
             */
            await loadNotifications();

        } catch (error) {

            console.error(
                "DELETE NOTIFICATION ERROR:",
                error
            );

            /*
             * Try to extract the actual message
             * returned by the backend.
             */
            const backendMessage =
                error?.response?.data;

            if (
                typeof backendMessage === "string"
                &&
                backendMessage.trim() !== ""
            ) {

                setSnackbarMessage(
                    backendMessage
                );

            }

            else if (
                backendMessage?.message
            ) {

                setSnackbarMessage(
                    backendMessage.message
                );

            }

            else if (
                error?.message
            ) {

                setSnackbarMessage(
                    error.message
                );

            }

            else {

                setSnackbarMessage(
                    "Failed to delete notification."
                );

            }

            setSnackbarOpen(true);

        }

    };

    /*
     |--------------------------------------------------------------------------
     | Filter Notifications
     |--------------------------------------------------------------------------
     */

    const filteredNotifications =
        useMemo(() => {

            return notifications.filter(
                (notification) => {

                    const search =
                        searchTerm
                            .trim()
                            .toLowerCase();

                    const medicineName =
                        notification
                            .medicineName
                            ?.toLowerCase() || "";

                    const batchNumber =
                        notification
                            .batchNumber
                            ?.toLowerCase() || "";

                    /*
                     * Category is still searchable
                     * even though it is no longer
                     * displayed as a table column.
                     */
                    const category =
                        notification
                            .category
                            ?.toLowerCase() || "";

                    const matchesSearch =

                        medicineName
                            .includes(search)

                        ||

                        batchNumber
                            .includes(search)

                        ||

                        category
                            .includes(search);

                    const matchesAlert =

                        selectedAlertType ===
                        "ALL"

                        ||

                        notification.alertType ===
                        selectedAlertType;

                    const matchesStatus =

                        selectedStatus ===
                        "ALL"

                        ||

                        notification.status ===
                        selectedStatus;

                    return (
                        matchesSearch
                        &&
                        matchesAlert
                        &&
                        matchesStatus
                    );

                }
            );

        }, [
            notifications,
            searchTerm,
            selectedAlertType,
            selectedStatus
        ]);

    /*
     |--------------------------------------------------------------------------
     | Notification Summary
     |--------------------------------------------------------------------------
     */

    const summary =
        useMemo(() => {

            return {

                lowStock:

                    notifications.filter(
                        notification =>
                            notification.alertType ===
                            "LOW_STOCK"
                    ).length,

                expiringSoon:

                    notifications.filter(
                        notification =>
                            notification.alertType ===
                            "EXPIRING_SOON"
                    ).length,

                expired:

                    notifications.filter(
                        notification =>
                            notification.alertType ===
                            "EXPIRED"
                    ).length,

                resolved:

                    notifications.filter(
                        notification =>
                            notification.status ===
                            "RESOLVED"
                    ).length,

                reviewed:

                    notifications.filter(
                        notification =>
                            notification.status ===
                            "REVIEWED"
                    ).length

            };

        }, [notifications]);

    /*
     |--------------------------------------------------------------------------
     | Review Notification
     |--------------------------------------------------------------------------
     */

    const handleReview = (
        notification
    ) => {

        setSelectedNotification(
            notification
        );

        setDialogOpen(true);

    };

    /*
     |--------------------------------------------------------------------------
     | Close Review Dialog
     |--------------------------------------------------------------------------
     */

    const handleCloseDialog = () => {

        setDialogOpen(false);

        setSelectedNotification(null);

    };

    /*
     |--------------------------------------------------------------------------
     | Render
     |--------------------------------------------------------------------------
     */

    return (

        <Box sx={{ p: 3 }}>

            <NotificationSummaryCards
                summary={summary}
            />

            <NotificationToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedAlertType={
                    selectedAlertType
                }
                onAlertTypeChange={
                    setSelectedAlertType
                }
                selectedStatus={
                    selectedStatus
                }
                onStatusChange={
                    setSelectedStatus
                }
                onRunCheck={
                    handleRunCheck
                }
                showRunCheck={
                    canRunCheck
                }
            />

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 8
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <NotificationTable

                    notifications={
                        filteredNotifications
                    }

                    canManage={
                        canManageNotifications
                    }

                    canDelete={
                        canDeleteNotifications
                    }

                    onReview={
                        handleReview
                    }

                    onDelete={
                        handleDelete
                    }

                />

            )}

            <ReviewNotificationDialog

                open={
                    dialogOpen
                }

                notification={
                    selectedNotification
                }

                onClose={
                    handleCloseDialog
                }

                onCompleted={
                    async () => {

                        handleCloseDialog();

                        await loadNotifications();

                    }
                }

            />

            <Snackbar

                open={
                    snackbarOpen
                }

                autoHideDuration={
                    4000
                }

                onClose={() =>
                    setSnackbarOpen(false)
                }

                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}

            >

                <Alert

                    severity="success"

                    variant="filled"

                    onClose={() =>
                        setSnackbarOpen(false)
                    }

                >

                    {snackbarMessage}

                </Alert>

            </Snackbar>

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mt: 3
                    }}
                >

                    {error}

                </Alert>

            )}

        </Box>

    );

}

export default Notifications;