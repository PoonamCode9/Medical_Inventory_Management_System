import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    reviewNotification
} from "../../services/notificationService";


function ReviewNotificationDialog({
    open,
    notification,
    onClose,
    onCompleted
}) {

    const [remarks, setRemarks] = useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (!open) {
            return;
        }

        setRemarks("");
        setError("");
        setSubmitting(false);

    }, [
        open,
        notification?.notificationId
    ]);


    const handleSubmit = async () => {

        if (!notification) {
            return;
        }

        try {

            setSubmitting(true);
            setError("");

            const payload = {

                userId: Number(
                    localStorage.getItem("userId")
                ),

                remarks: remarks.trim()

            };

            await reviewNotification(
                notification.notificationId,
                payload
            );

            onCompleted();

        } catch (error) {

            console.error(error);

            setError(
                "Failed to review notification."
            );

        } finally {

            setSubmitting(false);

        }

    };


    const alertType =
        notification?.alertType
            ?.replaceAll("_", " ") || "";


    return (

        <Dialog
            open={open}
            onClose={
                submitting
                    ? undefined
                    : onClose
            }
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden"
                }
            }}
        >

            <DialogTitle
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 2
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Review Notification
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Review the alert and add any relevant remarks.
                </Typography>

            </DialogTitle>


            <Divider />


            <DialogContent
                sx={{
                    px: 3,
                    py: 3
                }}
            >

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2.5,
                            borderRadius: 2
                        }}
                    >
                        {error}
                    </Alert>

                )}


                <Stack spacing={2}>

                    <TextField
                        label="Medicine"
                        value={
                            notification?.medicineName || ""
                        }
                        fullWidth
                        size="small"
                        InputProps={{
                            readOnly: true
                        }}
                    />


                    <TextField
                        label="Batch Number"
                        value={
                            notification?.batchNumber || ""
                        }
                        fullWidth
                        size="small"
                        InputProps={{
                            readOnly: true
                        }}
                    />


                    <TextField
                        label="Alert Type"
                        value={alertType}
                        fullWidth
                        size="small"
                        InputProps={{
                            readOnly: true
                        }}
                    />


                    <TextField
                        label="Current Quantity"
                        value={
                            notification?.quantity ?? ""
                        }
                        fullWidth
                        size="small"
                        InputProps={{
                            readOnly: true
                        }}
                    />


                    <TextField
                        label="Remarks"
                        value={remarks}
                        onChange={event =>
                            setRemarks(
                                event.target.value
                            )
                        }
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Enter your review remarks..."
                    />

                </Stack>

            </DialogContent>


            <Divider />


            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1
                }}
            >

                <Button
                    onClick={onClose}
                    disabled={submitting}
                    sx={{
                        px: 2,
                        textTransform: "none"
                    }}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        !notification ||
                        submitting
                    }
                    sx={{
                        minWidth: 90,
                        px: 2.5,
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >

                    {submitting
                        ? "Submitting..."
                        : "Review"}

                </Button>

            </DialogActions>

        </Dialog>

    );

}


export default ReviewNotificationDialog;