import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    getPurchaseOrders
} from "../../services/purchaseOrderService";

import PurchaseOrderToolbar from "../../components/purchaseOrders/PurchaseOrderToolbar";
import PurchaseOrderTable from "../../components/purchaseOrders/PurchaseOrderTable";
import PurchaseOrderDialog from "../../components/purchaseOrders/PurchaseOrderDialog";

function PurchaseOrders() {

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

    const loadPurchaseOrders = async () => {

        try {

            setLoading(true);

            const data = await getPurchaseOrders();

            setPurchaseOrders(data);

            setError("");

        } catch (err) {

            console.error(err);

            setError("Unable to load purchase orders.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        const timer = setTimeout(() => {

            loadPurchaseOrders();

        }, 0);

        return () => clearTimeout(timer);

    }, []);

    const filteredPurchaseOrders = purchaseOrders.filter((purchaseOrder) => {

        const value = searchTerm.toLowerCase();

        return (

            purchaseOrder.supplierName
                .toLowerCase()
                .includes(value)

            ||

            purchaseOrder.medicineName
                .toLowerCase()
                .includes(value)

            ||

            purchaseOrder.status
                .toLowerCase()
                .includes(value)

            ||

            purchaseOrder.orderId
                .toString()
                .includes(value)

        );

    });

    const handleOpenAdd = () => {

        setSelectedPurchaseOrder(null);

        setDialogOpen(true);

    };

    const handleOpenEdit = (purchaseOrder) => {

        if (purchaseOrder.status !== "PENDING") {

            alert(
                "Only pending purchase orders can be edited."
            );

            return;

        }

        setSelectedPurchaseOrder(purchaseOrder);

        setDialogOpen(true);

    };

    const handleCloseDialog = () => {

        setDialogOpen(false);

        setSelectedPurchaseOrder(null);

    };

    return (

        <Box>

            <PurchaseOrderToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={handleOpenAdd}
            />

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 8
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <PurchaseOrderTable
                    purchaseOrders={filteredPurchaseOrders}
                    onEdit={handleOpenEdit}
                />

            )}

            <PurchaseOrderDialog
                open={dialogOpen}
                purchaseOrder={selectedPurchaseOrder}
                onClose={handleCloseDialog}
                loadPurchaseOrders={loadPurchaseOrders}
            />

        </Box>

    );

}

export default PurchaseOrders;