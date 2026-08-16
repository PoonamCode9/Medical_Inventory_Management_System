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

import DeleteOutlineRoundedIcon
    from "@mui/icons-material/DeleteOutlineRounded";


const getAlertColor = alertType => {

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


const getStatusColor = status => {

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


const formatAlertType = alertType =>
    alertType
        ?.replaceAll("_", " ") || "-";


function NotificationTable({
    notifications,
    canManage,
    canDelete,
    onReview,
    onDelete
}) {

    if (notifications.length === 0) {

        return (

            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2
                }}
            >

                <Typography
                    color="text.secondary"
                >
                    No notifications found.
                </Typography>

            </Paper>

        );

    }


    const showActionColumn =
        canManage || canDelete;


    return (

        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 2,
                overflowX: "auto"
            }}
        >

            <Table
                size="small"
                sx={{
                    minWidth: 1050,

                    "& .MuiTableCell-root": {
                        py: 1.25
                    }
                }}
            >

                <TableHead>

                    <TableRow
                        sx={{
                            backgroundColor:
                                "action.hover"
                        }}
                    >

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Medicine
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap",
                                minWidth: 105
                            }}
                        >
                            Batch
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Quantity
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap",
                                minWidth: 120
                            }}
                        >
                            Expiry
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Days Left
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Alert
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Status
                        </TableCell>


                        {canDelete && (

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    color:
                                        "text.secondary",
                                    minWidth: 220
                                }}
                            >
                                Remarks
                            </TableCell>

                        )}


                        {showActionColumn && (

                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    color:
                                        "text.secondary",
                                    whiteSpace:
                                        "nowrap",
                                    minWidth: 120
                                }}
                            >
                                Actions
                            </TableCell>

                        )}

                    </TableRow>

                </TableHead>


                <TableBody>

                    {notifications.map(
                        notification => (

                            <TableRow
                                hover
                                key={
                                    notification.notificationId
                                }
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >

                                {/* MEDICINE */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            notification.medicineName ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* BATCH */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            notification.batchNumber ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* QUANTITY */}

                                <TableCell
                                    align="center"
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >
                                        {
                                            notification.quantity ??
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* EXPIRY */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            notification.expDate ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* DAYS LEFT */}

                                <TableCell
                                    align="center"
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {
                                            notification.daysRemaining ??
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* ALERT */}

                                <TableCell>

                                    <Chip
                                        label={
                                            formatAlertType(
                                                notification.alertType
                                            )
                                        }
                                        color={
                                            getAlertColor(
                                                notification.alertType
                                            )
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    />

                                </TableCell>


                                {/* STATUS */}

                                <TableCell>

                                    <Chip
                                        label={
                                            notification.status ||
                                            "-"
                                        }
                                        color={
                                            getStatusColor(
                                                notification.status
                                            )
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    />

                                </TableCell>


                                {/* REMARKS - ADMIN */}

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
                                                    notification.remarks
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


                                {/* ACTIONS */}

                                {showActionColumn && (

                                    <TableCell
                                        align="center"
                                    >

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "center",
                                                alignItems:
                                                    "center",
                                                gap: 1,
                                                flexWrap:
                                                    "wrap"
                                            }}
                                        >

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
                                                        sx={{
                                                            borderRadius: 1,
                                                            textTransform:
                                                                "none",
                                                            fontWeight:
                                                                600
                                                        }}
                                                    >
                                                        Review
                                                    </Button>

                                                )}


                                            {canDelete &&
                                                notification.status ===
                                                    "RESOLVED" && (

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={
                                                            <DeleteOutlineRoundedIcon
                                                                fontSize="small"
                                                            />
                                                        }
                                                        onClick={() =>
                                                            onDelete(
                                                                notification
                                                            )
                                                        }
                                                        sx={{
                                                            borderRadius: 1,
                                                            textTransform:
                                                                "none",
                                                            fontWeight:
                                                                600
                                                        }}
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