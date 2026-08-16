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

    const [formData, setFormData] =
        useState(initialFormData);

    const [medicines, setMedicines] =
        useState([]);

    const [errors, setErrors] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    const [apiError, setApiError] =
        useState("");


    async function loadMedicines() {

        try {

            const data =
                await getMedicines();

            setMedicines(data);

        } catch (error) {

            console.error(error);

            setApiError(
                "Unable to load medicines."
            );

        }

    }


    useEffect(() => {

        if (!open) {
            return undefined;
        }

        const timer =
            setTimeout(() => {

                loadMedicines();

                if (inventory) {

                    setFormData({

                        medicineId:
                            inventory.medicineId,

                        batchNumber:
                            inventory.batchNumber,

                        quantity:
                            inventory.quantity,

                        mfgDate:
                            inventory.mfgDate
                                ? inventory.mfgDate.substring(
                                    0,
                                    10
                                )
                                : "",

                        expDate:
                            inventory.expDate
                                ? inventory.expDate.substring(
                                    0,
                                    10
                                )
                                : ""

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

    }, [open, inventory]);


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


        if (!formData.medicineId) {

            validationErrors.medicineId =
                "Please select a medicine.";

        }


        if (!formData.batchNumber.trim()) {

            validationErrors.batchNumber =
                "Batch number is required.";

        }


        if (
            !formData.quantity ||
            Number(formData.quantity) <= 0
        ) {

            validationErrors.quantity =
                "Quantity must be greater than zero.";

        }


        if (!formData.mfgDate) {

            validationErrors.mfgDate =
                "Manufacturing date is required.";

        }


        if (!formData.expDate) {

            validationErrors.expDate =
                "Expiry date is required.";

        }


        if (
            formData.mfgDate &&
            formData.expDate &&
            formData.expDate <=
                formData.mfgDate
        ) {

            validationErrors.expDate =
                "Expiry date must be after manufacturing date.";

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

                if (inventory) {

                    await updateInventory(
                        inventory.batchId,
                        formData
                    );

                } else {

                    await addInventory(
                        formData
                    );

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
                    {inventory
                        ? "Edit Inventory"
                        : "Add Inventory"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    {inventory
                        ? "Update the inventory batch details below."
                        : "Enter the details for the new inventory batch."}
                </Typography>

            </DialogTitle>


            <Divider />


            {/* FORM */}

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


                <InventoryForm
                    formData={formData}
                    medicines={medicines}
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

                        inventory
                            ? "Update"
                            : "Save"

                    )}

                </Button>

            </DialogActions>

        </Dialog>

    );

}


export default InventoryDialog;