import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography
} from "@mui/material";

import {
    addMedicine,
    updateMedicine
} from "../../services/medicineService";

import {
    getSuppliers
} from "../../services/supplierService";

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

    const [formData, setFormData] =
        useState(initialFormData);

    const [suppliers, setSuppliers] =
        useState([]);

    const [errors, setErrors] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    const [apiError, setApiError] =
        useState("");


    async function loadSuppliers() {

        try {

            const data =
                await getSuppliers();

            setSuppliers(data);

        } catch (error) {

            console.error(
                "Load Suppliers Error:",
                error
            );

            setApiError(
                "Unable to load suppliers."
            );

        }

    }


    useEffect(() => {

        if (!open) {
            return undefined;
        }

        const timer =
            setTimeout(() => {

                loadSuppliers();

                if (medicine) {

                    setFormData({

                        name:
                            medicine.name,

                        category:
                            medicine.category,

                        price:
                            medicine.price,

                        supplierId:
                            medicine.supplierId

                    });

                } else {

                    setFormData(
                        initialFormData
                    );

                }

                setErrors({});
                setApiError("");

            }, 0);


        return () =>
            clearTimeout(timer);

    }, [open, medicine]);


    const handleChange =
        event => {

            const {
                name,
                value
            } = event.target;

            setFormData(previous => ({

                ...previous,

                [name]: value

            }));

        };


    const validate = () => {

        const validationErrors = {};


        if (!formData.name.trim()) {

            validationErrors.name =
                "Medicine name is required.";

        }


        if (!formData.category.trim()) {

            validationErrors.category =
                "Category is required.";

        }


        if (
            !formData.price ||
            Number(formData.price) <= 0
        ) {

            validationErrors.price =
                "Price must be greater than zero.";

        }


        if (!formData.supplierId) {

            validationErrors.supplierId =
                "Please select a supplier.";

        }


        setErrors(
            validationErrors
        );

        return (
            Object.keys(
                validationErrors
            ).length === 0
        );

    };


    const handleSave =
        async () => {

            if (!validate()) {
                return;
            }


            setLoading(true);
            setApiError("");


            try {

                console.log(
                    "Saving medicine..."
                );


                if (medicine) {

                    await updateMedicine(
                        medicine.medicineId,
                        formData
                    );

                } else {

                    await addMedicine(
                        formData
                    );

                }


                console.log(
                    "Medicine saved."
                );


                await refreshMedicines();


                console.log(
                    "Medicine list refreshed."
                );


                onClose();

            } catch (error) {

                console.error(
                    "Medicine Save Error:",
                    error
                );


                if (error.response) {

                    console.log(
                        "Status:",
                        error.response.status
                    );

                    console.log(
                        "Response:",
                        error.response.data
                    );


                    setApiError(
                        error.response.data?.message ||
                        `Request failed (${error.response.status})`
                    );

                } else {

                    setApiError(
                        "Unable to connect to the server."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


    return (

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden"
                }
            }}
        >

            {/* HEADER */}

            <DialogTitle
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 2
                }}
            >

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700
                    }}
                >
                    {medicine
                        ? "Edit Medicine"
                        : "Add Medicine"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    {medicine
                        ? "Update the medicine details below."
                        : "Enter the details for the new medicine."}
                </Typography>

            </DialogTitle>


            <Divider />


            {/* CONTENT */}

            <DialogContent
                sx={{
                    px: 3,
                    py: 3
                }}
            >

                {apiError && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2.5,
                            borderRadius: 2
                        }}
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


            {/* ACTIONS */}

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
                    disabled={loading}
                    sx={{
                        px: 2,
                        textTransform: "none"
                    }}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                        minWidth: 100,
                        textTransform: "none"
                    }}
                >

                    {loading ? (

                        <CircularProgress
                            size={21}
                            color="inherit"
                        />

                    ) : (

                        medicine
                            ? "Update"
                            : "Save"

                    )}

                </Button>

            </DialogActions>

        </Dialog>

    );

}


export default MedicineDialog;