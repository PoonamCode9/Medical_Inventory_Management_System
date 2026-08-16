import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    getAllInventory
} from "../../services/inventoryService";

import InventoryToolbar
    from "../../components/inventory/InventoryToolbar";

import InventoryTable
    from "../../components/inventory/InventoryTable";

import InventoryDialog
    from "../../components/inventory/InventoryDialog";

import DeleteInventoryDialog
    from "../../components/inventory/DeleteInventoryDialog";


function InventoryList() {

    const [inventory, setInventory] =
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

    const [selectedInventory, setSelectedInventory] =
        useState(null);


    // Logged-in user's role
    const role =
        localStorage.getItem("role");


    const loadInventory = async () => {

        try {

            setLoading(true);

            const data =
                await getAllInventory();

            setInventory(data);

            setError("");

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load inventory."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        const timer =
            setTimeout(() => {
                loadInventory();
            }, 0);

        return () =>
            clearTimeout(timer);

    }, []);


    const filteredInventory =
        inventory.filter(item =>
            item.medicineName
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )
        );


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

            <InventoryToolbar
                role={role}
                searchTerm={searchTerm}
                onSearchChange={
                    setSearchTerm
                }
                onAdd={() => {

                    setSelectedInventory(
                        null
                    );

                    setDialogOpen(true);

                }}
            />


            {/* TABLE / LOADING */}

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

                <InventoryTable
                    role={role}
                    inventory={
                        filteredInventory
                    }
                    onEdit={item => {

                        setSelectedInventory(
                            item
                        );

                        setDialogOpen(true);

                    }}
                    onDelete={item => {

                        setSelectedInventory(
                            item
                        );

                        setDeleteOpen(true);

                    }}
                />

            )}


            {/* ADD / EDIT DIALOG */}

            <InventoryDialog
                open={dialogOpen}
                inventory={
                    selectedInventory
                }
                onClose={() =>
                    setDialogOpen(false)
                }
                refreshInventory={
                    loadInventory
                }
            />


            {/* DELETE DIALOG */}

            <DeleteInventoryDialog
                open={deleteOpen}
                inventory={
                    selectedInventory
                }
                onClose={() =>
                    setDeleteOpen(false)
                }
                refreshInventory={
                    loadInventory
                }
            />

        </Box>

    );

}


export default InventoryList;