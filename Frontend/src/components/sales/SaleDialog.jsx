import { useEffect, useMemo, useState } from "react";

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
    createSale
} from "../../services/saleService";

import {
    getAllInventory
} from "../../services/inventoryService";

import SaleForm from "./SaleForm";

const initialFormData = {
    batchId: "",
    customerName: "",
    quantity: ""
};

function SaleDialog({
    open,
    onClose,
    refreshSales
}) {

    const [formData, setFormData] =
        useState(initialFormData);

    const [inventory, setInventory] =
        useState([]);

    const [errors, setErrors] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    const [loadingInventory, setLoadingInventory] =
        useState(false);

    const [apiError, setApiError] =
        useState("");


    /*
     |--------------------------------------------------------------------------
     | Load Inventory
     |--------------------------------------------------------------------------
     */

    const loadInventory = async () => {

        try {

            setLoadingInventory(true);

            const data =
                await getAllInventory();

            setInventory(data);

            setApiError("");

        } catch (error) {

            console.error(
                "Load Inventory Error:",
                error
            );

            setApiError(
                "Unable to load inventory."
            );

        } finally {

            setLoadingInventory(false);

        }

    };


    /*
     |--------------------------------------------------------------------------
     | Initialize Dialog
     |--------------------------------------------------------------------------
     */

    useEffect(() => {

        if (!open) {
            return;
        }

        setFormData({
            ...initialFormData
        });

        setErrors({});

        setApiError("");

        loadInventory();

    }, [open]);


    /*
     |--------------------------------------------------------------------------
     | Handle Form Change
     |--------------------------------------------------------------------------
     */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );


        /*
         * Clear the validation error
         * when the user changes the field.
         */

        if (errors[name]) {

            setErrors(
                previous => {

                    const updated = {
                        ...previous
                    };

                    delete updated[name];

                    return updated;

                }
            );

        }

    };


    /*
     |--------------------------------------------------------------------------
     | Selected Inventory
     |--------------------------------------------------------------------------
     */

    const selectedInventory =
        inventory.find(
            item =>
                String(item.batchId) ===
                String(formData.batchId)
        );


    /*
     |--------------------------------------------------------------------------
     | Calculate Display Total
     |--------------------------------------------------------------------------
     *
     * This is only the frontend preview.
     *
     * The backend remains responsible for
     * calculating the actual sale amount.
     */

    const totalAmount =
        useMemo(() => {

            if (!selectedInventory) {
                return 0;
            }


            const quantity =
                Number(
                    formData.quantity
                );


            const price =
                Number(
                    selectedInventory.medicinePrice
                );


            if (
                !quantity ||
                quantity <= 0 ||
                !price
            ) {

                return 0;

            }


            return quantity * price;

        }, [
            selectedInventory,
            formData.quantity
        ]);


    /*
     |--------------------------------------------------------------------------
     | Validate Form
     |--------------------------------------------------------------------------
     */

    const validate = () => {

        const validationErrors = {};


        /*
         * Batch validation.
         */

        if (!formData.batchId) {

            validationErrors.batchId =
                "Please select an inventory batch.";

        }


        /*
         * Quantity validation.
         */

        const quantity =
            Number(
                formData.quantity
            );


        if (
            !formData.quantity ||
            quantity <= 0
        ) {

            validationErrors.quantity =
                "Quantity must be greater than zero.";

        }


        /*
         * Make sure the requested quantity
         * does not exceed available stock.
         */

        if (
            selectedInventory &&
            quantity >
            Number(
                selectedInventory.quantity
            )
        ) {

            validationErrors.quantity =
                `Only ${selectedInventory.quantity} unit(s) are available.`;

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


    /*
     |--------------------------------------------------------------------------
     | Save Sale
     |--------------------------------------------------------------------------
     */

    const handleSave = async () => {

        if (!validate()) {
            return;
        }


        /*
         * Get the currently logged-in user's ID.
         */

        const userId =
            Number(
                localStorage.getItem(
                    "userId"
                )
            );


        if (!userId) {

            setApiError(
                "Unable to identify the logged-in user."
            );

            return;

        }


        try {

            setLoading(true);

            setApiError("");


            /*
             * Build request payload.
             *
             * Price is intentionally NOT sent.
             *
             * The backend gets the actual medicine
             * price from the database.
             */

            const payload = {

                batchId:
                    Number(
                        formData.batchId
                    ),

                userId:
                    userId,

                customerName:
                    formData.customerName
                        .trim(),

                quantity:
                    Number(
                        formData.quantity
                    )

            };


            await createSale(
                payload
            );


            /*
             * Refresh sales after
             * successful creation.
             */

            await refreshSales();


            /*
             * Close the dialog.
             */

            onClose();

        } catch (error) {

            console.error(
                "Create Sale Error:",
                error
            );


            /*
             * Extract backend error message
             * when available.
             */

            if (error.response) {

                const responseData =
                    error.response.data;


                if (
                    typeof responseData ===
                    "string"
                ) {

                    setApiError(
                        responseData
                    );

                }

                else if (
                    responseData?.message
                ) {

                    setApiError(
                        responseData.message
                    );

                }

                else {

                    setApiError(
                        `Request failed (${error.response.status}).`
                    );

                }

            }

            else {

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
        >

            <DialogTitle>
                Record Sale
            </DialogTitle>


            <DialogContent>

                {apiError && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2
                        }}
                    >

                        {apiError}

                    </Alert>

                )}


                {loadingInventory ? (

                    <CircularProgress
                        size={24}
                        sx={{
                            display: "block",
                            mx: "auto",
                            my: 4
                        }}
                    />

                ) : (

                    <SaleForm

                        formData={
                            formData
                        }

                        inventory={
                            inventory
                        }

                        errors={
                            errors
                        }

                        totalAmount={
                            totalAmount
                        }

                        onChange={
                            handleChange
                        }

                    />

                )}

            </DialogContent>


            <DialogActions
                sx={{
                    px: 3,
                    pb: 3
                }}
            >

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={
                        loading ||
                        loadingInventory ||
                        inventory.length === 0
                    }
                >

                    {loading ? (

                        <CircularProgress
                            size={22}
                            color="inherit"
                        />

                    ) : (

                        "Record Sale"

                    )}

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default SaleDialog;