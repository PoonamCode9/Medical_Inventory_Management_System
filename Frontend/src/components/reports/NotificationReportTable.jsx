import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

function NotificationReportTable({
    records = []
}) {

    /*
     |--------------------------------------------------------------------------
     | Alert Color
     |--------------------------------------------------------------------------
     */

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


    /*
     |--------------------------------------------------------------------------
     | Status Color
     |--------------------------------------------------------------------------
     */

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


    /*
     |--------------------------------------------------------------------------
     | Format Date + Time
     |--------------------------------------------------------------------------
     |
     | Instead of:
     *
     * 09/08/2026, 20:19:35
     *
     | we display:
     *
     * 09 Aug 2026
     * 08:19 PM
     *
     */

    const formatDateTime = (value) => {

        if (!value) {

            return {
                date: "—",
                time: ""
            };

        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {

            return {
                date: value,
                time: ""
            };

        }

        return {

            date: date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            ),

            time: date.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            )

        };

    };


    /*
     |--------------------------------------------------------------------------
     | Date Cell
     |--------------------------------------------------------------------------
     */

    const DateTimeCell = ({
        value
    }) => {

        const formatted =
            formatDateTime(value);

        return (

            <Box
                sx={{
                    lineHeight: 1.25
                }}
            >

                <Typography
                    variant="body2"
                    fontWeight={500}
                    noWrap
                >

                    {formatted.date}

                </Typography>

                {formatted.time && (

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                    >

                        {formatted.time}

                    </Typography>

                )}

            </Box>

        );

    };


    /*
     |--------------------------------------------------------------------------
     | Alert Label
     |--------------------------------------------------------------------------
     */

    const formatAlertType = (
        alertType
    ) => {

        if (!alertType) {
            return "—";
        }

        return alertType.replaceAll(
            "_",
            " "
        );

    };


    /*
     |--------------------------------------------------------------------------
     | Empty State
     |--------------------------------------------------------------------------
     */

    if (records.length === 0) {

        return (

            <Paper
                elevation={2}
                sx={{
                    mt: 3,
                    p: 5,
                    borderRadius: 2,
                    textAlign: "center"
                }}
            >

                <Typography
                    color="text.secondary"
                >

                    No notification records found.

                </Typography>

            </Paper>

        );

    }


    /*
     |--------------------------------------------------------------------------
     | Table
     |--------------------------------------------------------------------------
     */

    return (

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                mt: 3,
                borderRadius: 2,
                overflowX: "auto",
                border: "1px solid",
                borderColor: "divider"
            }}
        >

            <Table
                sx={{
                    minWidth: 1400,
                    tableLayout: "fixed"
                }}
            >

                {/* ========================================================= */}
                {/* HEADER */}
                {/* ========================================================= */}

                <TableHead>

                    <TableRow
                        sx={{
                            backgroundColor:
                                "action.hover"
                        }}
                    >

                        <TableCell
                            sx={{
                                width: 65,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                ID

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 185,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Medicine

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 140,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Batch

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 145,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Alert

                            </Typography>

                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                width: 80,
                                py: 2,
                                px: 1
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Qty.

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 120,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Expiry

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 110,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Status

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 125,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Created

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 115,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Reviewed By

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 125,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Reviewed

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 220,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Remarks

                            </Typography>

                        </TableCell>


                        <TableCell
                            sx={{
                                width: 125,
                                py: 2,
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >

                                Resolved

                            </Typography>

                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* ========================================================= */}
                {/* BODY */}
                {/* ========================================================= */}

                <TableBody>

                    {records.map(
                        (notification) => (

                            <TableRow
                                hover
                                key={
                                    notification.notificationId
                                }
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    },

                                    "&:hover": {
                                        backgroundColor:
                                            "action.hover"
                                    }
                                }}
                            >

                                {/* ID */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >

                                        {
                                            notification.notificationId
                                        }

                                    </Typography>

                                </TableCell>


                                {/* MEDICINE */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        noWrap
                                    >

                                        {
                                            notification.medicineName
                                        }

                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        noWrap
                                    >

                                        ID: {
                                            notification.medicineId
                                        }

                                    </Typography>

                                </TableCell>


                                {/* BATCH */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        noWrap
                                    >

                                        {
                                            notification.batchNumber
                                        }

                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        noWrap
                                    >

                                        ID: {
                                            notification.batchId
                                        }

                                    </Typography>

                                </TableCell>


                                {/* ALERT */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

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
                                            borderRadius: 1.5
                                        }}
                                    />

                                </TableCell>


                                {/* QUANTITY */}

                                <TableCell
                                    align="center"
                                    sx={{
                                        py: 2,
                                        px: 1
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >

                                        {
                                            notification.quantity
                                        }

                                    </Typography>

                                </TableCell>


                                {/* EXPIRY */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        noWrap
                                    >

                                        {
                                            notification.expDate
                                        }

                                    </Typography>

                                </TableCell>


                                {/* STATUS */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <Chip
                                        label={
                                            notification.status
                                        }
                                        color={
                                            getStatusColor(
                                                notification.status
                                            )
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            borderRadius: 1.5
                                        }}
                                    />

                                </TableCell>


                                {/* CREATED */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <DateTimeCell
                                        value={
                                            notification.createdDate
                                        }
                                    />

                                </TableCell>


                                {/* REVIEWED BY */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        noWrap
                                    >

                                        {
                                            notification.reviewedBy
                                                || "—"
                                        }

                                    </Typography>

                                </TableCell>


                                {/* REVIEWED */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <DateTimeCell
                                        value={
                                            notification.reviewedDate
                                        }
                                    />

                                </TableCell>


                                {/* REMARKS */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    {
                                        notification.remarks ? (

                                            <Tooltip
                                                title={
                                                    notification.remarks
                                                }
                                                arrow
                                            >

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                        cursor: "help"
                                                    }}
                                                >

                                                    {
                                                        notification.remarks
                                                    }

                                                </Typography>

                                            </Tooltip>

                                        ) : (

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >

                                                —

                                            </Typography>

                                        )
                                    }

                                </TableCell>


                                {/* RESOLVED */}

                                <TableCell
                                    sx={{
                                        py: 2,
                                        px: 2
                                    }}
                                >

                                    <DateTimeCell
                                        value={
                                            notification.resolvedDate
                                        }
                                    />

                                </TableCell>

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default NotificationReportTable;