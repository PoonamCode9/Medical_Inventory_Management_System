import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import {
    getMedicines
} from "../../services/medicineService";

import {
    addInventory,
    updateInventory
} from "../../services/inventoryService";

import InventoryForm from "./InventoryForm";

const initialFormData = {
    medicineId: "",
    batchNumber: "",
    quantity: "",
    mfgDate: "",
    expDate: ""
};

function InventoryDialog({
    open,
    inventory,
    onClose,
    refreshInventory
}) {

    const [formData, setFormData] = useState(initialFormData);
    const [medicines, setMedicines] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    async function loadMedicines() {

        try {

            const data = await getMedicines();
            setMedicines(data);

        } catch (error) {

            console.error(error);
            setApiError("Unable to load medicines.");

        }

    }

    useEffect(() => {

        if (!open) {
            return undefined;
        }

        const timer = setTimeout(() => {

            loadMedicines();

            if (inventory) {

                setFormData({
                    medicineId: inventory.medicineId,
                    batchNumber: inventory.batchNumber,
                    quantity: inventory.quantity,
                    mfgDate: inventory.mfgDate
                        ? inventory.mfgDate.substring(0, 10)
                        : "",
                    expDate: inventory.expDate
                        ? inventory.expDate.substring(0, 10)
                        : ""
                });

            } else {

                setFormData(initialFormData);

            }

            setErrors({});
            setApiError("");

        }, 0);

        return () => clearTimeout(timer);

    }, [open, inventory]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };

    const validate = () => {

        const validationErrors = {};

        if (!formData.medicineId) {
            validationErrors.medicineId = "Please select a medicine.";
        }

        if (!formData.batchNumber.trim()) {
            validationErrors.batchNumber = "Batch number is required.";
        }

        if (!formData.quantity || Number(formData.quantity) <= 0) {
            validationErrors.quantity = "Quantity must be greater than zero.";
        }

        if (!formData.mfgDate) {
            validationErrors.mfgDate = "Manufacturing date is required.";
        }

        if (!formData.expDate) {
            validationErrors.expDate = "Expiry date is required.";
        }

        if (
            formData.mfgDate &&
            formData.expDate &&
            formData.expDate <= formData.mfgDate
        ) {
            validationErrors.expDate =
                "Expiry date must be after manufacturing date.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;

    };

    const handleSave = async () => {

        if (!validate()) {
            return;
        }

        setLoading(true);
        setApiError("");

        try {

            if (inventory) {

                await updateInventory(
                    inventory.batchId,
                    formData
                );

            } else {

                await addInventory(formData);

            }

            await refreshInventory();
            onClose();

        } catch (error) {

            console.error(error);

            if (error.response) {

                setApiError(
                    error.response.data?.message ||
                    `Request failed (${error.response.status})`
                );

            } else {

                setApiError("Unable to connect to the server.");

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                {inventory
                    ? "Edit Inventory"
                    : "Add Inventory"}

            </DialogTitle>

            <DialogContent>

                {apiError && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {apiError}
                    </Alert>

                )}

                <InventoryForm
                    formData={formData}
                    medicines={medicines}
                    errors={errors}
                    onChange={handleChange}
                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                >

                    {loading
                        ? <CircularProgress size={22} color="inherit" />
                        : inventory
                            ? "Update"
                            : "Save"}

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default InventoryDialog;
