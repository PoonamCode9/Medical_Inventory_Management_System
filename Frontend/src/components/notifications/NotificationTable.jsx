import {
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

function NotificationTable({
    notifications,
    canManage,
    onReview,
    onResolve
}) {

    const getAlertColor = (alertType) => {

        switch (alertType) {

            case "LOW_STOCK":
                return "primary";

            case "EXPIRING_SOON":
                return "warning";

            case "EXPIRED":
                return "error";

            default:
                return "default";

        }

    };

    const getStatusColor = (status) => {

        switch (status) {

            case "ACTIVE":
                return "error";

            case "REVIEWED":
                return "warning";

            case "RESOLVED":
                return "success";

            default:
                return "default";

        }

    };

    if (notifications.length === 0) {

        return (

            <Paper
                elevation={2}
                sx={{
                    p: 5,
                    textAlign: "center"
                }}
            >

                <Typography color="text.secondary">
                    No notifications found.
                </Typography>

            </Paper>

        );

    }

    return (

        <TableContainer
            component={Paper}
            elevation={3}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Medicine</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Batch</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Category</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Expiry</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Days Left</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Alert</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        {
                            canManage
                            &&
                            (
                                <TableCell align="center">
                                    <strong>Action</strong>
                                </TableCell>
                            )
                        }

                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        notifications.map((notification) => (

                            <TableRow
                                hover
                                key={notification.notificationId}
                            >

                                <TableCell>
                                    {notification.medicineName}
                                </TableCell>

                                <TableCell>
                                    {notification.batchNumber}
                                </TableCell>

                                <TableCell>
                                    {notification.category}
                                </TableCell>

                                <TableCell align="center">
                                    {notification.quantity}
                                </TableCell>

                                <TableCell>
                                    {notification.expDate}
                                </TableCell>

                                <TableCell align="center">
                                    {notification.daysRemaining}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={notification.alertType.replaceAll("_", " ")}
                                        color={getAlertColor(notification.alertType)}
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={notification.status}
                                        color={getStatusColor(notification.status)}
                                        size="small"
                                    />

                                </TableCell>

                                {
                                    canManage
                                    &&
                                    (
                                        <TableCell align="center">

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: 1
                                                }}
                                            >

                                                {
                                                    notification.status === "ACTIVE"
                                                    &&
                                                    (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() =>
                                                                onReview(notification)
                                                            }
                                                        >
                                                            Review
                                                        </Button>
                                                    )
                                                }

                                                {
                                                    notification.status !== "RESOLVED"
                                                    &&
                                                    (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() =>
                                                                onResolve(notification)
                                                            }
                                                        >
                                                            Resolve
                                                        </Button>
                                                    )
                                                }

                                            </Box>

                                        </TableCell>
                                    )
                                }

                            </TableRow>

                        ))
                    }

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default NotificationTable;
