import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import {
    getNotifications,
    runNotificationCheck
} from "../../services/notificationService";

import NotificationToolbar from "../../components/notifications/NotificationToolbar";
import NotificationSummaryCards from "../../components/notifications/NotificationSummaryCards";
import NotificationTable from "../../components/notifications/NotificationTable";
import ResolveNotificationDialog from "../../components/notifications/ResolveNotificationDialog";

function Notifications() {

    const role = localStorage.getItem("role");

    const canRunCheck = role === "ADMIN";

    const canManageNotifications =
        role === "ADMIN" || role === "PHARMACIST";

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedAlertType, setSelectedAlertType] =
        useState("ALL");

    const [selectedStatus, setSelectedStatus] =
        useState("ALL");

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    const [dialogAction, setDialogAction] =
        useState("resolve");

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    const loadNotifications = useCallback(async () => {

        try {

            setLoading(true);

            const data = await getNotifications();

            setNotifications(data);

            setError("");

        }

        catch {

            setError(
                "Unable to load notifications."
            );

        }

        finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        const timer = setTimeout(() => {
            loadNotifications();
        }, 0);

        return () => clearTimeout(timer);

    }, [loadNotifications]);

    const handleRunCheck = async () => {

        try {

            const message =
                await runNotificationCheck();

            setSnackbarMessage(message);

            setSnackbarOpen(true);

            await loadNotifications();

        }

        catch {

            setSnackbarMessage(
                "Failed to run notification check."
            );

            setSnackbarOpen(true);

        }

    };

    const filteredNotifications =
        useMemo(() => {

            return notifications.filter((notification) => {

                const search =
                    searchTerm.toLowerCase();

                const matchesSearch =

                    notification.medicineName
                        .toLowerCase()
                        .includes(search)

                    ||

                    notification.batchNumber
                        .toLowerCase()
                        .includes(search)

                    ||

                    notification.category
                        .toLowerCase()
                        .includes(search);

                const matchesAlert =

                    selectedAlertType === "ALL"

                    ||

                    notification.alertType ===
                    selectedAlertType;

                const matchesStatus =

                    selectedStatus === "ALL"

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

            });

        }, [

            notifications,

            searchTerm,

            selectedAlertType,

            selectedStatus

        ]);

    const summary = useMemo(() => {

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

    const openDialog = (
        notification,
        action
    ) => {

        setSelectedNotification(
            notification
        );

        setDialogAction(action);

        setDialogOpen(true);

    };

    const handleReview = (
        notification
    ) => {

        openDialog(
            notification,
            "review"
        );

    };

    const handleResolve = (
        notification
    ) => {

        openDialog(
            notification,
            "resolve"
        );

    };

    const handleCloseDialog = () => {

        setDialogOpen(false);

        setSelectedNotification(null);

    };

    return (

        <Box sx={{ p: 3 }}>

            <NotificationSummaryCards
                summary={summary}
            />

            <NotificationToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedAlertType={selectedAlertType}
                onAlertTypeChange={setSelectedAlertType}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onRunCheck={handleRunCheck}
                showRunCheck={canRunCheck}
            />

            {
                loading ?

                    (

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 8
                            }}
                        >

                            <CircularProgress />

                        </Box>

                    )

                    :

                    (

                        <NotificationTable
                            notifications={
                                filteredNotifications
                            }
                            canManage={
                                canManageNotifications
                            }
                            onResolve={
                                handleResolve
                            }
                            onReview={
                                handleReview
                            }
                        />

                    )

            }

            <ResolveNotificationDialog

                open={dialogOpen}

                notification={selectedNotification}

                actionType={dialogAction}

                onClose={handleCloseDialog}

                onCompleted={async () => {

                    handleCloseDialog();

                    await loadNotifications();

                }}

            />

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

                    severity="success"

                    variant="filled"

                    onClose={() =>
                        setSnackbarOpen(false)
                    }

                >

                    {snackbarMessage}

                </Alert>

            </Snackbar>

            {

                error && (

                    <Alert
                        severity="error"
                        sx={{
                            mt: 3
                        }}
                    >

                        {error}

                    </Alert>

                )

            }

        </Box>

    );

}

export default Notifications;