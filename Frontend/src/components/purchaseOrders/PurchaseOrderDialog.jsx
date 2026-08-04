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
    addPurchaseOrder,
    updatePurchaseOrder
} from "../../services/purchaseOrderService";

import { getMedicines } from "../../services/medicineService";
import { getSuppliers } from "../../services/supplierService";

import PurchaseOrderForm from "./PurchaseOrderForm";

const initialFormData = {
    supplierId: "",
    medicineId: "",
    quantity: "",
    expectedDeliveryDate: "",
    status: "PENDING"
};

function PurchaseOrderDialog({
    open,
    purchaseOrder,
    onClose,
    loadPurchaseOrders
}) {

    const [formData, setFormData] = useState(initialFormData);

    const [suppliers, setSuppliers] = useState([]);

    const [medicines, setMedicines] = useState([]);

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

    async function loadMedicines() {

        try {

            const data = await getMedicines();

            setMedicines(data);

        } catch (error) {

            console.error("Load Medicines Error:", error);

            setApiError("Unable to load medicines.");

        }

    }

    useEffect(() => {

        if (!open) {
            return undefined;
        }

        const timer = setTimeout(() => {

            loadSuppliers();

            loadMedicines();

            if (purchaseOrder) {

                setFormData({

                    supplierId: purchaseOrder.supplierId,
                    medicineId: purchaseOrder.medicineId,
                    quantity: purchaseOrder.quantity,
                    expectedDeliveryDate:
                        purchaseOrder.expectedDeliveryDate,
                    status: purchaseOrder.status

                });

            } else {

                setFormData(initialFormData);

            }

            setErrors({});

            setApiError("");

        }, 0);

        return () => clearTimeout(timer);

    }, [open, purchaseOrder]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData(previous => ({

            ...previous,

            [name]: value

        }));

    };

    const validate = () => {

        const validationErrors = {};

        if (!formData.supplierId) {

            validationErrors.supplierId =
                "Please select a supplier.";

        }

        if (!formData.medicineId) {

            validationErrors.medicineId =
                "Please select a medicine.";

        }

        if (

            !formData.quantity ||

            Number(formData.quantity) <= 0

        ) {

            validationErrors.quantity =
                "Quantity must be greater than zero.";

        }

        if (!formData.expectedDeliveryDate) {

            validationErrors.expectedDeliveryDate =
                "Expected delivery date is required.";

        }

        if (!formData.status) {

            validationErrors.status =
                "Please select a status.";

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

            console.log("Saving purchase order...");

            if (purchaseOrder) {

                await updatePurchaseOrder(

                    purchaseOrder.orderId,

                    formData

                );

            } else {

                await addPurchaseOrder(formData);

            }

            console.log("Purchase order saved.");

            await loadPurchaseOrders();

            console.log("Purchase order list refreshed.");

            onClose();

        } catch (error) {

            console.error(

                "Purchase Order Save Error:",

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
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                {purchaseOrder

                    ? "Edit Purchase Order"

                    : "Add Purchase Order"}

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

                <PurchaseOrderForm
                    formData={formData}
                    suppliers={suppliers}
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

                    {loading ? (

                        <CircularProgress
                            size={22}
                            color="inherit"
                        />

                    ) : (

                        purchaseOrder

                            ? "Update"

                            : "Save"

                    )}

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default PurchaseOrderDialog;
