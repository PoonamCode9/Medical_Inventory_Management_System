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

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

function NotificationTable({
    notifications,
    canManage,
    canDelete,
    onReview,
    onDelete
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

    /*
     * Admin can:
     * - Review ACTIVE notifications
     * - Delete RESOLVED notifications
     *
     * Pharmacist can:
     * - Review ACTIVE notifications
     */
    const showActionColumn =
        canManage || canDelete;

    return (

        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 3,
                overflowX: "auto"
            }}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Medicine</strong>
                        </TableCell>

                        <TableCell
                            sx={{
                                minWidth: 105
                            }}
                        >
                            <strong>Batch</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell
                            sx={{
                                minWidth: 130
                            }}
                        >
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

                        {/*
                         * Review remarks are displayed
                         * to Admin only.
                         */}
                        {canDelete && (

                            <TableCell
                                sx={{
                                    minWidth: 220
                                }}
                            >
                                <strong>Remarks</strong>
                            </TableCell>

                        )}

                        {showActionColumn && (

                            <TableCell align="center">
                                <strong>Action</strong>
                            </TableCell>

                        )}

                    </TableRow>

                </TableHead>

                <TableBody>

                    {notifications.map(
                        (notification) => (

                            <TableRow
                                hover
                                key={
                                    notification.notificationId
                                }
                            >

                                <TableCell>

                                    <Typography
                                        fontWeight={600}
                                    >

                                        {
                                            notification
                                                .medicineName
                                        }

                                    </Typography>

                                </TableCell>

                                <TableCell
                                    sx={{
                                        minWidth: 105
                                    }}
                                >

                                    {notification.batchNumber}

                                </TableCell>

                                <TableCell align="center">

                                    {notification.quantity}

                                </TableCell>

                                <TableCell
                                    sx={{
                                        minWidth: 130
                                    }}
                                >

                                    {notification.expDate}

                                </TableCell>

                                <TableCell align="center">

                                    {notification.daysRemaining}

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            notification
                                                .alertType
                                                .replaceAll(
                                                    "_",
                                                    " "
                                                )
                                        }
                                        color={
                                            getAlertColor(
                                                notification
                                                    .alertType
                                            )
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            notification.status
                                        }
                                        color={
                                            getStatusColor(
                                                notification
                                                    .status
                                            )
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                {/*
                                 * Admin can see review remarks.
                                 */}
                                {canDelete && (

                                    <TableCell
                                        sx={{
                                            minWidth: 220,
                                            maxWidth: 320
                                        }}
                                    >

                                        {notification.remarks ? (

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    whiteSpace:
                                                        "normal",
                                                    wordBreak:
                                                        "break-word"
                                                }}
                                            >

                                                {
                                                    notification
                                                        .remarks
                                                }

                                            </Typography>

                                        ) : (

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >

                                                No remarks

                                            </Typography>

                                        )}

                                    </TableCell>

                                )}

                                {showActionColumn && (

                                    <TableCell align="center">

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "center",
                                                gap: 1,
                                                flexWrap: "wrap"
                                            }}
                                        >

                                            {/*
                                             * ACTIVE notifications
                                             * can be reviewed by
                                             * Admin or Pharmacist.
                                             */}
                                            {canManage &&

                                                notification.status ===
                                                "ACTIVE" && (

                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() =>
                                                            onReview(
                                                                notification
                                                            )
                                                        }
                                                    >

                                                        Review

                                                    </Button>

                                                )}

                                            {/*
                                             * Only Admin can delete
                                             * automatically resolved
                                             * notifications.
                                             */}
                                            {canDelete &&

                                                notification.status ===
                                                "RESOLVED" && (

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={
                                                            <DeleteOutlineRoundedIcon />
                                                        }
                                                        onClick={() =>
                                                            onDelete(
                                                                notification
                                                            )
                                                        }
                                                    >

                                                        Delete

                                                    </Button>

                                                )}

                                        </Box>

                                    </TableCell>

                                )}

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default NotificationTable;