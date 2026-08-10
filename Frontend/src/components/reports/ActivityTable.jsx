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
    Tooltip,
    Typography
} from "@mui/material";

import VisibilityRoundedIcon
    from "@mui/icons-material/VisibilityRounded";

function ActivityTable({
    activities = [],
    onView
}) {

    const actionColors = {
        CREATED: "success",
        UPDATED: "warning",
        DELETED: "error",
        APPROVED: "info",
        DELIVERED: "primary",
        REVIEWED: "secondary",
        RESOLVED: "secondary"
    };

    const moduleColors = {
        MEDICINE: "primary",
        INVENTORY: "success",
        SUPPLIER: "info",
        PURCHASE_ORDER: "warning",
        NOTIFICATION: "secondary",
        USER: "error"
    };

    const formatModule = (module) =>
        module?.replaceAll("_", " ") || "—";

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

    if (!activities.length) {

        return (
            <Paper
                elevation={2}
                sx={{
                    p: 5,
                    borderRadius: 3,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider"
                }}
            >
                <Typography
                    color="text.secondary"
                >
                    No activity history found.
                </Typography>
            </Paper>
        );

    }

    return (

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                borderRadius: 3,
                overflowX: "auto",
                border: "1px solid",
                borderColor: "divider"
            }}
        >

            <Table
                sx={{
                    minWidth: 1150,
                    tableLayout: "fixed"
                }}
            >

                <TableHead>

                    <TableRow
                        sx={{
                            backgroundColor: "action.hover"
                        }}
                    >

                        <TableCell sx={{ width: 130 }}>
                            <strong>Date & Time</strong>
                        </TableCell>

                        <TableCell sx={{ width: 180 }}>
                            <strong>User</strong>
                        </TableCell>

                        <TableCell sx={{ width: 110 }}>
                            <strong>Role</strong>
                        </TableCell>

                        <TableCell sx={{ width: 140 }}>
                            <strong>Module</strong>
                        </TableCell>

                        <TableCell sx={{ width: 120 }}>
                            <strong>Action</strong>
                        </TableCell>

                        <TableCell sx={{ width: 390 }}>
                            <strong>Description</strong>
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{ width: 110 }}
                        >
                            <strong>Details</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {activities.map((activity) => {

                        const dateTime =
                            formatDateTime(
                                activity.performedAt
                            );

                        return (

                            <TableRow
                                key={activity.logId}
                                hover
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >

                                {/* Date & Time */}

                                <TableCell
                                    sx={{
                                        py: 2
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        noWrap
                                    >
                                        {dateTime.date}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        noWrap
                                    >
                                        {dateTime.time}
                                    </Typography>

                                </TableCell>


                                {/* User */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        noWrap
                                    >
                                        {
                                            activity.performedBy
                                            || "—"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* Role */}

                                <TableCell>

                                    <Chip
                                        label={
                                            activity.userRole
                                            || "—"
                                        }
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600
                                        }}
                                    />

                                </TableCell>


                                {/* Module */}

                                <TableCell>

                                    <Chip
                                        label={
                                            formatModule(
                                                activity.module
                                            )
                                        }
                                        color={
                                            moduleColors[
                                                activity.module
                                            ] || "default"
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 600
                                        }}
                                    />

                                </TableCell>


                                {/* Action */}

                                <TableCell>

                                    <Chip
                                        label={
                                            activity.action
                                        }
                                        color={
                                            actionColors[
                                                activity.action
                                            ] || "default"
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 600
                                        }}
                                    />

                                </TableCell>


                                {/* Description */}

                                <TableCell>

                                    <Tooltip
                                        title={
                                            activity.description
                                            || "No description available."
                                        }
                                        arrow
                                    >

                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                                cursor: "help"
                                            }}
                                        >
                                            {
                                                activity.description
                                                || "—"
                                            }
                                        </Typography>

                                    </Tooltip>

                                </TableCell>


                                {/* View */}

                                <TableCell align="center">

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={
                                            <VisibilityRoundedIcon />
                                        }
                                        onClick={() =>
                                            onView(activity)
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                            borderRadius: 1.5,
                                            fontWeight: 600
                                        }}
                                    >
                                        View
                                    </Button>

                                </TableCell>

                            </TableRow>

                        );

                    })}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default ActivityTable;