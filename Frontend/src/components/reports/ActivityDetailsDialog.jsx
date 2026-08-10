import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography
} from "@mui/material";

function ActivityDetailsDialog({
    open,
    activity,
    onClose
}) {

    if (!activity) {
        return null;
    }

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
                    second: "2-digit",
                    hour12: true
                }
            )
        };

    };

    const dateTime =
        formatDateTime(
            activity.performedAt
        );

    const InfoItem = ({
        label,
        children
    }) => (

        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
            >
                {label}
            </Typography>

            <Box sx={{ mt: 0.5 }}>
                {children}
            </Box>

        </Box>

    );

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            {/* ============================================================= */}
            {/* HEADER */}
            {/* ============================================================= */}

            <DialogTitle
                sx={{
                    pb: 1.5
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Activity Details
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    Complete information about this
                    system activity.
                </Typography>

            </DialogTitle>

            <Divider />


            {/* ============================================================= */}
            {/* CONTENT */}
            {/* ============================================================= */}

            <DialogContent
                sx={{
                    py: 3
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* Module */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoItem label="Module">

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

                        </InfoItem>

                    </Grid>


                    {/* Action */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoItem label="Action">

                            <Chip
                                label={
                                    activity.action
                                    || "—"
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

                        </InfoItem>

                    </Grid>


                    {/* Reference */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoItem label="Reference">

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >

                                {
                                    activity.referenceName
                                    || "—"
                                }

                            </Typography>

                            {activity.referenceId && (

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >

                                    ID: {
                                        activity.referenceId
                                    }

                                </Typography>

                            )}

                        </InfoItem>

                    </Grid>


                    {/* User */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoItem label="Performed By">

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                    wordBreak: "break-word"
                                }}
                            >

                                {
                                    activity.performedBy
                                    || "—"
                                }

                            </Typography>

                        </InfoItem>

                    </Grid>


                    {/* Role */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoItem label="User Role">

                            <Chip
                                label={
                                    activity.userRole
                                    || "—"
                                }
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontWeight: 600
                                }}
                            />

                        </InfoItem>

                    </Grid>


                    {/* Date */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <InfoItem label="Performed At">

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >

                                {dateTime.date}

                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >

                                {dateTime.time}

                            </Typography>

                        </InfoItem>

                    </Grid>


                    {/* Description */}

                    <Grid
                        item
                        xs={12}
                    >

                        <InfoItem label="Description">

                            <Box
                                sx={{
                                    mt: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "action.hover",
                                    border: "1px solid",
                                    borderColor:
                                        "divider"
                                }}
                            >

                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1.7,
                                        whiteSpace:
                                            "pre-wrap",
                                        wordBreak:
                                            "break-word"
                                    }}
                                >

                                    {
                                        activity.description
                                        || "No description available."
                                    }

                                </Typography>

                            </Box>

                        </InfoItem>

                    </Grid>

                </Grid>

            </DialogContent>


            {/* ============================================================= */}
            {/* FOOTER */}
            {/* ============================================================= */}

            <Divider />

            <DialogActions
                sx={{
                    px: 3,
                    py: 2
                }}
            >

                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >

                    Close

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ActivityDetailsDialog;