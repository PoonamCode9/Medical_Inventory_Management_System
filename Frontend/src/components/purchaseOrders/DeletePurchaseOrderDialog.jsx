import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

import { useState } from "react";

import {
    deletePurchaseOrder
} from "../../services/purchaseOrderService";

function DeletePurchaseOrderDialog({
    open,
    purchaseOrder,
    onClose,
    loadPurchaseOrders
}) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {

        if (!purchaseOrder) {
            return;
        }

        setLoading(true);
        setError("");

        try {

            await deletePurchaseOrder(
                purchaseOrder.orderId
            );

            await loadPurchaseOrders();

            onClose();

        } catch (err) {

            console.error(err);

            setError(
                "Failed to delete purchase order."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="xs"
        >

            <DialogTitle>
                Delete Purchase Order
            </DialogTitle>

            <DialogContent>

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}

                <DialogContentText>

                    Are you sure you want to delete
                    Purchase Order{" "}
                    <strong>
                        #{purchaseOrder?.orderId}
                    </strong>
                    ?

                    <br />
                    <br />

                    This action cannot be undone.

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={loading}
                >

                    {loading ? (

                        <CircularProgress
                            size={22}
                            color="inherit"
                        />

                    ) : (

                        "Delete"

                    )}

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default DeletePurchaseOrderDialog;