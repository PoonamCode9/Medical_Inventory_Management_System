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

import { deleteMedicine } from "../../services/medicineService";

function DeleteMedicineDialog({
    open,
    medicine,
    onClose,
    refreshMedicines
}) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {

        if (!medicine) {
            return;
        }

        setLoading(true);
        setError("");

        try {

            await deleteMedicine(medicine.medicineId);

            await refreshMedicines();

            onClose();

        } catch (err) {

            console.error(err);
            setError("Failed to delete medicine.");

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
                Delete Medicine
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
                    Are you sure you want to delete{" "}
                    <strong>{medicine?.name}</strong>?
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

export default DeleteMedicineDialog;