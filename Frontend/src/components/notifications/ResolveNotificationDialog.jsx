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
    resolveNotification,
    reviewNotification
} from "../../services/notificationService";

function ResolveNotificationDialog({
    open,
    notification,
    actionType,
    onClose,
    onCompleted
}) {

    const [remarks, setRemarks] = useState("");

    const isReview = actionType === "review";

    useEffect(() => {

        if (!open) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setRemarks("");
        }, 0);

        return () => clearTimeout(timer);

    }, [open, notification?.notificationId]);

    const handleSubmit = async () => {

        try {

            const payload = {
                userId: Number(
                    localStorage.getItem("userId")
                ),
                remarks
            };

            if (isReview) {
                await reviewNotification(
                    notification.notificationId,
                    payload
                );
            } else {
                await resolveNotification(
                    notification.notificationId,
                    payload
                );
            }

            onCompleted();

        }

        catch {

            alert(
                isReview
                    ? "Failed to review notification."
                    : "Failed to resolve notification."
            );

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                {isReview ? "Review Notification" : "Resolve Notification"}
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={3}
                    sx={{ mt: 1 }}
                >

                    <TextField
                        label="Medicine"
                        value={
                            notification?.medicineName || ""
                        }
                        fullWidth
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
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!notification}
                >
                    {isReview ? "Review" : "Resolve"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ResolveNotificationDialog;
