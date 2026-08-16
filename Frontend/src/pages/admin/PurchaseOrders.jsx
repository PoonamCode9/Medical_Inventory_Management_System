import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    getPurchaseOrders
} from "../../services/purchaseOrderService";

import PurchaseOrderToolbar
    from "../../components/purchaseOrders/PurchaseOrderToolbar";

import PurchaseOrderTable
    from "../../components/purchaseOrders/PurchaseOrderTable";

import PurchaseOrderDialog
    from "../../components/purchaseOrders/PurchaseOrderDialog";

import DeletePurchaseOrderDialog
    from "../../components/purchaseOrders/DeletePurchaseOrderDialog";


function PurchaseOrders() {

    const [purchaseOrders, setPurchaseOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
        useState(null);


    /* LOAD PURCHASE ORDERS */

    const loadPurchaseOrders = async () => {

        try {

            setLoading(true);

            const data =
                await getPurchaseOrders();

            setPurchaseOrders(data);

            setError("");

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load purchase orders."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        const timer =
            setTimeout(() => {

                loadPurchaseOrders();

            }, 0);

        return () =>
            clearTimeout(timer);

    }, []);


    /* SEARCH */

    const filteredPurchaseOrders =
        purchaseOrders.filter(
            purchaseOrder => {

                const value =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return (

                    purchaseOrder.supplierName
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    purchaseOrder.medicineName
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    purchaseOrder.status
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    purchaseOrder.orderId
                        ?.toString()
                        .includes(value)

                );

            }
        );


    /* ADD */

    const handleOpenAdd = () => {

        setSelectedPurchaseOrder(
            null
        );

        setDialogOpen(true);

    };


    /* EDIT */

    const handleOpenEdit =
        purchaseOrder => {

            setSelectedPurchaseOrder(
                purchaseOrder
            );

            setDialogOpen(true);

        };


    /* CLOSE EDIT / ADD */

    const handleCloseDialog = () => {

        setDialogOpen(false);

        setSelectedPurchaseOrder(
            null
        );

    };


    /* DELETE */

    const handleOpenDelete =
        purchaseOrder => {

            setSelectedPurchaseOrder(
                purchaseOrder
            );

            setDeleteOpen(true);

        };


    /* CLOSE DELETE */

    const handleCloseDelete = () => {

        setDeleteOpen(false);

        setSelectedPurchaseOrder(
            null
        );

    };


    return (

        <Box>

            {/* ERROR */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* TOOLBAR */}

            <PurchaseOrderToolbar
                searchTerm={searchTerm}
                onSearchChange={
                    setSearchTerm
                }
                onAdd={
                    handleOpenAdd
                }
            />


            {/* TABLE */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 220
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <PurchaseOrderTable
                    purchaseOrders={
                        filteredPurchaseOrders
                    }
                    onEdit={
                        handleOpenEdit
                    }
                    onDelete={
                        handleOpenDelete
                    }
                />

            )}


            {/* ADD / EDIT DIALOG */}

            <PurchaseOrderDialog
                open={dialogOpen}
                purchaseOrder={
                    selectedPurchaseOrder
                }
                onClose={
                    handleCloseDialog
                }
                loadPurchaseOrders={
                    loadPurchaseOrders
                }
            />


            {/* DELETE DIALOG */}

            <DeletePurchaseOrderDialog
                open={deleteOpen}
                purchaseOrder={
                    selectedPurchaseOrder
                }
                onClose={
                    handleCloseDelete
                }
                loadPurchaseOrders={
                    loadPurchaseOrders
                }
            />

        </Box>

    );

}


export default PurchaseOrders;