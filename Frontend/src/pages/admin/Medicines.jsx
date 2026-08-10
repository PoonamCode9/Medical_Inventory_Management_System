import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    getMedicines
} from "../../services/medicineService";

import MedicineToolbar from "../../components/medicines/MedicineToolbar";
import MedicineTable from "../../components/medicines/MedicineTable";
import MedicineDialog from "../../components/medicines/MedicineDialog";
import DeleteMedicineDialog from "../../components/medicines/DeleteMedicineDialog";

function Medicines() {

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedMedicine, setSelectedMedicine] = useState(null);

    // Get logged-in user's role
    const role = localStorage.getItem("role");

    const loadMedicines = async () => {

        try {

            setLoading(true);

            const data = await getMedicines();

            setMedicines(data);

            setError("");

        } catch (err) {

            console.error(err);

            setError("Unable to load medicines.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        const timer = setTimeout(() => {

            loadMedicines();

        }, 0);

        return () => clearTimeout(timer);

    }, []);

    const filteredMedicines = medicines.filter((medicine) => {

        const value = searchTerm.toLowerCase();

        return (

            medicine.name.toLowerCase().includes(value) ||

            medicine.category.toLowerCase().includes(value) ||

            medicine.supplierName.toLowerCase().includes(value)

        );

    });

    const handleOpenAdd = () => {

        setSelectedMedicine(null);

        setDialogOpen(true);

    };

    const handleOpenEdit = (medicine) => {

        setSelectedMedicine(medicine);

        setDialogOpen(true);

    };

    const handleCloseDialog = () => {

        setDialogOpen(false);

        setSelectedMedicine(null);

    };

    const handleOpenDelete = (medicine) => {

        setSelectedMedicine(medicine);

        setDeleteOpen(true);

    };

    const handleCloseDelete = () => {

        setDeleteOpen(false);

        setSelectedMedicine(null);

    };

    return (

        <Box>

            <MedicineToolbar
                role={role}
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

                <MedicineTable
                    role={role}
                    medicines={filteredMedicines}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />

            )}

            <MedicineDialog
                open={dialogOpen}
                medicine={selectedMedicine}
                onClose={handleCloseDialog}
                refreshMedicines={loadMedicines}
            />

            <DeleteMedicineDialog
                open={deleteOpen}
                medicine={selectedMedicine}
                onClose={handleCloseDelete}
                refreshMedicines={loadMedicines}
            />

        </Box>

    );

}

export default Medicines;