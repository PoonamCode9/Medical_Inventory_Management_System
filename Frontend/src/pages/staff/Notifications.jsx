import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    getNotifications
} from "../../services/notificationService";

import NotificationToolbar from "../../components/notifications/NotificationToolbar";
import NotificationTable from "../../components/notifications/NotificationTable";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [selectedAlertType, setSelectedAlertType] = useState("ALL");

    const loadNotifications = async () => {

        try {

            setLoading(true);

            const data = await getNotifications();

            setNotifications(data);

            setError("");

        }

        catch (err) {

            console.error(err);

            setError("Unable to load notifications.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadNotifications();

    }, []);

    const filteredNotifications = notifications.filter((notification) => {

        const search = searchTerm.toLowerCase();

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

        const matchesStatus =

            selectedStatus === "ALL"

            ||

            notification.status === selectedStatus;

        const matchesAlert =

            selectedAlertType === "ALL"

            ||

            notification.alertType === selectedAlertType;

        return (

            matchesSearch

            &&

            matchesStatus

            &&

            matchesAlert

        );

    });

    return (

        <Box>

            <NotificationToolbar

                searchTerm={searchTerm}

                onSearchChange={setSearchTerm}

                selectedAlertType={selectedAlertType}

                onAlertTypeChange={setSelectedAlertType}

                selectedStatus={selectedStatus}

                onStatusChange={setSelectedStatus}

                showRunCheck={false}

            />

            {

                error

                &&

                (

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >

                        {error}

                    </Alert>

                )

            }

            {

                loading

                ?

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

                        notifications={filteredNotifications}

                        canManage={false}

                    />

                )

            }

        </Box>

    );

}

export default Notifications;