import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import {
    getMedicines
} from "../../services/medicineService";

import MedicineToolbar from "../../components/medicines/MedicineToolbar";
import MedicineTable from "../../components/medicines/MedicineTable";
import MedicineDialog from "../../components/medicines/MedicineDialog";
import DeleteMedicineDialog from "../../components/medicines/DeleteMedicineDialog";

function MedicineList() {

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedMedicine, setSelectedMedicine] = useState(null);

    // Logged-in user's role
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

    const filteredMedicines = medicines.filter((medicine) =>
        medicine.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Medicine Management
            </Typography>

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}

            <MedicineToolbar
                role={role}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => {

                    setSelectedMedicine(null);

                    setDialogOpen(true);

                }}
            />

            {loading ? (

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={5}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <MedicineTable
                    role={role}
                    medicines={filteredMedicines}
                    onEdit={(medicine) => {

                        setSelectedMedicine(medicine);

                        setDialogOpen(true);

                    }}
                    onDelete={(medicine) => {

                        setSelectedMedicine(medicine);

                        setDeleteOpen(true);

                    }}
                />

            )}

            <MedicineDialog
                open={dialogOpen}
                medicine={selectedMedicine}
                onClose={() => setDialogOpen(false)}
                refreshMedicines={loadMedicines}
            />

            <DeleteMedicineDialog
                open={deleteOpen}
                medicine={selectedMedicine}
                onClose={() => setDeleteOpen(false)}
                refreshMedicines={loadMedicines}
            />

        </Box>

    );

}

export default MedicineList;