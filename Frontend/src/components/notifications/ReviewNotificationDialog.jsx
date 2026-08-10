import { useEffect, useState } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
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
        >

            <DialogTitle>
                Review Notification
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={3}
                    sx={{ mt: 1 }}
                >

                    <TextField
                        label="Medicine"
                        value={
                            notification?.medicineName ||
                            ""
                        }
                        fullWidth
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <TextField
                        label="Batch Number"
                        value={
                            notification?.batchNumber ||
                            ""
                        }
                        fullWidth
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <TextField
                        label="Alert Type"
                        value={
                            notification?.alertType
                                ?.replaceAll(
                                    "_",
                                    " "
                                ) || ""
                        }
                        fullWidth
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <TextField
                        label="Current Quantity"
                        value={
                            notification?.quantity ??
                            ""
                        }
                        fullWidth
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <TextField
                        label="Remarks"
                        value={remarks}
                        onChange={(event) =>
                            setRemarks(
                                event.target.value
                            )
                        }
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Enter your review remarks..."
                        error={Boolean(error)}
                        helperText={error}
                    />

                </Stack>

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3
                }}
            >

                <Button
                    onClick={onClose}
                    disabled={submitting}
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