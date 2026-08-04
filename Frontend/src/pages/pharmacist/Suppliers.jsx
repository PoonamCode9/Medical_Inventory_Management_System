import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import {
    addSupplier,
    getSuppliers,
    updateSupplier
} from "../../services/supplierService";

const emptySupplierForm = {
    name: "",
    phNo: "",
    email: "",
    address: ""
};

function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [formData, setFormData] = useState(emptySupplierForm);

    const loadSuppliers = useCallback(async () => {

        try {

            const data = await getSuppliers();

            setSuppliers(data);

            setError("");

        } catch {

            setError("Unable to load suppliers.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        const initialTimer = setTimeout(() => {

            loadSuppliers();

        }, 0);

        const refreshTimer = setInterval(() => {

            loadSuppliers();

        }, 15000);

        return () => {

            clearTimeout(initialTimer);

            clearInterval(refreshTimer);

        };

    }, [loadSuppliers]);

    const filteredSuppliers = useMemo(() => {

        const query = search.trim().toLowerCase();

        if (!query) {

            return suppliers;

        }

        return suppliers.filter((supplier) => (

            supplier.name?.toLowerCase().includes(query) ||

            supplier.email?.toLowerCase().includes(query) ||

            supplier.phNo?.toLowerCase().includes(query)

        ));

    }, [search, suppliers]);

    const handleOpenAdd = () => {

        setDialogMode("add");

        setFormData(emptySupplierForm);

        setDialogOpen(true);

    };

    const handleOpenEdit = (supplier) => {

        setDialogMode("edit");

        setFormData({

            supplierId: supplier.supplierId,

            name: supplier.name || "",

            phNo: supplier.phNo || "",

            email: supplier.email || "",

            address: supplier.address || ""

        });

        setDialogOpen(true);

    };

    const handleChange = (event) => {

        setFormData({

            ...formData,

            [event.target.name]: event.target.value

        });

    };

    const buildPayload = () => ({

        name: formData.name.trim(),

        phNo: formData.phNo.trim(),

        email: formData.email.trim(),

        address: formData.address.trim()

    });

    const handleSubmit = async () => {

        try {

            if (dialogMode === "edit") {

                await updateSupplier(

                    formData.supplierId,

                    buildPayload()

                );

                setSnackbar("Supplier updated.");

            } else {

                await addSupplier(buildPayload());

                setSnackbar("Supplier added.");

            }

            setDialogOpen(false);

            await loadSuppliers();

        } catch {

            setError("Unable to save supplier.");

        }

    };

    return (

        <Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap"
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Suppliers
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <TextField
                        size="small"
                        placeholder="Search suppliers..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={handleOpenAdd}
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Add Supplier
                    </Button>

                </Box>

            </Box>

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
                        py: 8
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{
                        borderRadius: 3
                    }}
                >

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    <b>Supplier</b>
                                </TableCell>

                                <TableCell>
                                    <b>Phone</b>
                                </TableCell>

                                <TableCell>
                                    <b>Email</b>
                                </TableCell>

                                <TableCell>
                                    <b>Address</b>
                                </TableCell>

                                <TableCell align="right">
                                    <b>Actions</b>
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                                                        {filteredSuppliers.length === 0 && (

                                <TableRow>

                                    <TableCell colSpan={5}>

                                        <Box
                                            sx={{
                                                py: 5,
                                                textAlign: "center"
                                            }}
                                        >

                                            <Typography
                                                color="text.secondary"
                                            >
                                                No suppliers found.
                                            </Typography>

                                        </Box>

                                    </TableCell>

                                </TableRow>

                            )}

                            {filteredSuppliers.map((supplier) => (

                                <TableRow
                                    key={supplier.supplierId}
                                    hover
                                >

                                    <TableCell>

                                        <Typography fontWeight={600}>
                                            {supplier.name}
                                        </Typography>

                                    </TableCell>

                                    <TableCell>
                                        {supplier.phNo || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {supplier.email || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {supplier.address || "-"}
                                    </TableCell>

                                    <TableCell align="right">

                                        <Tooltip title="Edit Supplier">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    handleOpenEdit(supplier)
                                                }
                                            >

                                                <EditRoundedIcon />

                                            </IconButton>

                                        </Tooltip>

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>

            )}

            <SupplierDialog
                open={dialogOpen}
                mode={dialogMode}
                value={formData}
                onChange={handleChange}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmit}
            />

            <Snackbar
                open={Boolean(snackbar)}
                autoHideDuration={2500}
                onClose={() => setSnackbar("")}
                message={snackbar}
            />

        </Box>

    );

}

function SupplierDialog({

    open,
    mode,
    value,
    onChange,
    onClose,
    onSubmit

}) {

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                {mode === "edit"
                    ? "Edit Supplier"
                    : "Add Supplier"}

            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <TextField
                        label="Supplier Name"
                        name="name"
                        value={value.name}
                        onChange={onChange}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Phone"
                        name="phNo"
                        value={value.phNo}
                        onChange={onChange}
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        value={value.email}
                        onChange={onChange}
                        fullWidth
                    />

                    <TextField
                        label="Address"
                        name="address"
                        value={value.address}
                        onChange={onChange}
                        fullWidth
                        multiline
                        minRows={3}
                    />

                </Stack>

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3
                }}
            >

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={!value.name}
                >

                    {mode === "edit"
                        ? "Save Changes"
                        : "Add Supplier"}

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default Suppliers;