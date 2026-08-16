import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar,
    Typography
} from "@mui/material";

import {
    deleteNotification,
    getNotifications,
    runNotificationCheck
} from "../../services/notificationService";

import NotificationToolbar
    from "../../components/notifications/NotificationToolbar";

import NotificationSummaryCards
    from "../../components/notifications/NotificationSummaryCards";

import NotificationTable
    from "../../components/notifications/NotificationTable";

import ReviewNotificationDialog
    from "../../components/notifications/ReviewNotificationDialog";


function Notifications() {

    const role =
        localStorage.getItem("role");


    /* Permissions */

    const canRunCheck =
        role === "ADMIN";

    const canManageNotifications =
        role === "ADMIN" ||
        role === "PHARMACIST";

    const canDeleteNotifications =
        role === "ADMIN";


    /* Data */

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* Filters */

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedAlertType, setSelectedAlertType] =
        useState("ALL");

    const [selectedStatus, setSelectedStatus] =
        useState("ALL");


    /* Review dialog */

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [selectedNotification, setSelectedNotification] =
        useState(null);


    /* Snackbar */

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState("success");


    /* Load notifications */

    const loadNotifications =
        useCallback(async () => {

            try {

                setLoading(true);

                const data =
                    await getNotifications();

                setNotifications(
                    data || []
                );

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


    /* Initial load */

    useEffect(() => {

        const timer =
            setTimeout(
                loadNotifications,
                0
            );

        return () =>
            clearTimeout(timer);

    }, [loadNotifications]);


    /* Snackbar helper */

    const showSnackbar = (
        message,
        severity = "success"
    ) => {

        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);

    };


    /* Run notification check */

    const handleRunCheck = async () => {

        try {

            const message =
                await runNotificationCheck();

            showSnackbar(
                message,
                "success"
            );

            await loadNotifications();

        } catch (error) {

            console.error(
                "RUN NOTIFICATION CHECK ERROR:",
                error
            );

            showSnackbar(
                "Failed to run notification check.",
                "error"
            );

        }

    };


    /* Delete notification */

    const handleDelete = async (
        notification
    ) => {

        if (!notification) {
            return;
        }


        if (!canDeleteNotifications) {

            showSnackbar(
                "Only administrators can delete notifications.",
                "error"
            );

            return;

        }


        if (
            notification.status !==
            "RESOLVED"
        ) {

            showSnackbar(
                "Only resolved notifications can be deleted.",
                "error"
            );

            return;

        }


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

            showSnackbar(
                "Notification deleted successfully.",
                "success"
            );

            await loadNotifications();

        } catch (error) {

            console.error(
                "DELETE NOTIFICATION ERROR:",
                error
            );


            const backendMessage =
                error?.response?.data;


            if (
                typeof backendMessage ===
                    "string" &&
                backendMessage.trim()
            ) {

                showSnackbar(
                    backendMessage,
                    "error"
                );

            } else if (
                backendMessage?.message
            ) {

                showSnackbar(
                    backendMessage.message,
                    "error"
                );

            } else if (
                error?.message
            ) {

                showSnackbar(
                    error.message,
                    "error"
                );

            } else {

                showSnackbar(
                    "Failed to delete notification.",
                    "error"
                );

            }

        }

    };


    /* Filter notifications */

    const filteredNotifications =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            return notifications.filter(
                notification => {

                    const medicineName =
                        notification
                            .medicineName
                            ?.toLowerCase() || "";


                    const batchNumber =
                        notification
                            .batchNumber
                            ?.toLowerCase() || "";


                    const category =
                        notification
                            .category
                            ?.toLowerCase() || "";


                    const matchesSearch =
                        medicineName.includes(search) ||
                        batchNumber.includes(search) ||
                        category.includes(search);


                    const matchesAlert =
                        selectedAlertType ===
                            "ALL" ||
                        notification.alertType ===
                            selectedAlertType;


                    const matchesStatus =
                        selectedStatus ===
                            "ALL" ||
                        notification.status ===
                            selectedStatus;


                    return (
                        matchesSearch &&
                        matchesAlert &&
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


    /* Summary */

    const summary =
        useMemo(() => ({

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

        }), [notifications]);


    /* Review */

    const handleReview =
        notification => {

            setSelectedNotification(
                notification
            );

            setDialogOpen(true);

        };


    const handleCloseDialog = () => {

        setDialogOpen(false);
        setSelectedNotification(null);

    };


    return (

        <Box>

            {/* Page Header */}

            <Box
                sx={{
                    mb: 3
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                        letterSpacing: "-0.5px"
                    }}
                >
                    Notifications
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    Monitor stock alerts, expiry warnings
                    and notification activity.
                </Typography>

            </Box>


            {/* Summary Cards */}

            <NotificationSummaryCards
                summary={summary}
            />


            {/* Filters / Actions */}

            <NotificationToolbar
                searchTerm={searchTerm}
                onSearchChange={
                    setSearchTerm
                }

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


            {/* Error */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* Loading / Table */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 220
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


            {/* Review Dialog */}

            <ReviewNotificationDialog
                open={dialogOpen}
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

                        showSnackbar(
                            "Notification reviewed successfully.",
                            "success"
                        );

                    }
                }
            />


            {/* Snackbar */}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbarOpen(false)
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbarSeverity}
                    variant="filled"
                    onClose={() =>
                        setSnackbarOpen(false)
                    }
                    sx={{
                        width: "100%"
                    }}
                >
                    {snackbarMessage}
                </Alert>

            </Snackbar>

        </Box>

    );

}


export default Notifications;