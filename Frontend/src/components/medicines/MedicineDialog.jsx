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
    addMedicine,
    updateMedicine
} from "../../services/medicineService";

import { getSuppliers } from "../../services/supplierService";

import MedicineForm from "./MedicineForm";

const initialFormData = {
    name: "",
    category: "",
    price: "",
    supplierId: ""
};

function MedicineDialog({
    open,
    medicine,
    onClose,
    refreshMedicines
}) {

    const [formData, setFormData] = useState(initialFormData);
    const [suppliers, setSuppliers] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    async function loadSuppliers() {

        try {

            const data = await getSuppliers();

            setSuppliers(data);

        } catch (error) {

            console.error("Load Suppliers Error:", error);

            setApiError("Unable to load suppliers.");

        }

    }

    useEffect(() => {

        if (!open) {
            return undefined;
        }

        const timer = setTimeout(() => {

            loadSuppliers();

            if (medicine) {

                setFormData({
                    name: medicine.name,
                    category: medicine.category,
                    price: medicine.price,
                    supplierId: medicine.supplierId
                });

            } else {

                setFormData(initialFormData);

            }

            setErrors({});
            setApiError("");

        }, 0);

        return () => clearTimeout(timer);

    }, [open, medicine]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };

    const validate = () => {

        const validationErrors = {};

        if (!formData.name.trim()) {
            validationErrors.name = "Medicine name is required.";
        }

        if (!formData.category.trim()) {
            validationErrors.category = "Category is required.";
        }

        if (!formData.price || Number(formData.price) <= 0) {
            validationErrors.price = "Price must be greater than zero.";
        }

        if (!formData.supplierId) {
            validationErrors.supplierId = "Please select a supplier.";
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

            console.log("Saving medicine...");

            if (medicine) {

                await updateMedicine(
                    medicine.medicineId,
                    formData
                );

            } else {

                await addMedicine(formData);

            }

            console.log("Medicine saved.");

            await refreshMedicines();

            console.log("Medicine list refreshed.");

            onClose();

        } catch (error) {

            console.error("Medicine Save Error:", error);

            if (error.response) {

                console.log("Status:", error.response.status);
                console.log("Response:", error.response.data);

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
                {medicine ? "Edit Medicine" : "Add Medicine"}
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

                <MedicineForm
                    formData={formData}
                    suppliers={suppliers}
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
                    {loading ? (
                        <CircularProgress
                            size={22}
                            color="inherit"
                        />
                    ) : (
                        medicine ? "Update" : "Save"
                    )}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default MedicineDialog;
