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
    Divider,
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

import AddRoundedIcon
    from "@mui/icons-material/AddRounded";

import EditRoundedIcon
    from "@mui/icons-material/EditRounded";

import DeleteRoundedIcon
    from "@mui/icons-material/DeleteRounded";

import {
    addSupplier,
    deleteSupplier,
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

    const [suppliers, setSuppliers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [snackbar, setSnackbar] =
        useState("");

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [dialogMode, setDialogMode] =
        useState("add");

    const [formData, setFormData] =
        useState(emptySupplierForm);

    const [deleteTarget, setDeleteTarget] =
        useState(null);


    /* LOAD SUPPLIERS */

    const loadSuppliers =
        useCallback(async () => {

            try {

                const data =
                    await getSuppliers();

                setSuppliers(data);
                setError("");

            } catch {

                setError(
                    "Unable to load suppliers."
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        const initialTimer =
            setTimeout(() => {

                loadSuppliers();

            }, 0);


        const refreshTimer =
            setInterval(() => {

                loadSuppliers();

            }, 15000);


        return () => {

            clearTimeout(
                initialTimer
            );

            clearInterval(
                refreshTimer
            );

        };

    }, [loadSuppliers]);


    /* SEARCH */

    const filteredSuppliers =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {

                return suppliers;

            }


            return suppliers.filter(
                supplier => (

                    supplier.name
                        ?.toLowerCase()
                        .includes(query) ||

                    supplier.email
                        ?.toLowerCase()
                        .includes(query) ||

                    supplier.phNo
                        ?.toLowerCase()
                        .includes(query)

                )
            );

        }, [search, suppliers]);


    /* ADD */

    const handleOpenAdd = () => {

        setDialogMode("add");

        setFormData(
            emptySupplierForm
        );

        setDialogOpen(true);

    };


    /* EDIT */

    const handleOpenEdit =
        supplier => {

            setDialogMode("edit");

            setFormData({

                supplierId:
                    supplier.supplierId,

                name:
                    supplier.name || "",

                phNo:
                    supplier.phNo || "",

                email:
                    supplier.email || "",

                address:
                    supplier.address || ""

            });

            setDialogOpen(true);

        };


    /* FORM CHANGE */

    const handleChange =
        event => {

            setFormData({

                ...formData,

                [event.target.name]:
                    event.target.value

            });

        };


    /* PAYLOAD */

    const buildPayload =
        () => ({

            name:
                formData.name.trim(),

            phNo:
                formData.phNo.trim(),

            email:
                formData.email.trim(),

            address:
                formData.address.trim()

        });


    /* SAVE */

    const handleSubmit =
        async () => {

            try {

                if (
                    dialogMode === "edit"
                ) {

                    await updateSupplier(
                        formData.supplierId,
                        buildPayload()
                    );

                    setSnackbar(
                        "Supplier updated."
                    );

                } else {

                    await addSupplier(
                        buildPayload()
                    );

                    setSnackbar(
                        "Supplier added."
                    );

                }


                setDialogOpen(false);

                await loadSuppliers();

            } catch {

                setError(
                    "Unable to save supplier."
                );

            }

        };


    /* DELETE */

    const handleDelete =
        async () => {

            try {

                await deleteSupplier(
                    deleteTarget.supplierId
                );

                setDeleteTarget(null);

                setSnackbar(
                    "Supplier deleted."
                );

                await loadSuppliers();

            } catch {

                setError(
                    "Unable to delete supplier."
                );

            }

        };


    return (

        <Box>

            {/* TOOLBAR */}

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

                <TextField
                    label="Search Suppliers"
                    placeholder="Search by name, email or phone..."
                    size="small"
                    value={search}
                    onChange={event =>
                        setSearch(
                            event.target.value
                        )
                    }
                    sx={{
                        flexGrow: 1,
                        minWidth: {
                            xs: "100%",
                            sm: 300
                        },
                        maxWidth: 500
                    }}
                />


                <Button
                    variant="contained"
                    startIcon={
                        <AddRoundedIcon />
                    }
                    onClick={
                        handleOpenAdd
                    }
                    sx={{
                        minHeight: 40,
                        px: 2.5,
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        flexShrink: 0
                    }}
                >
                    Add Supplier
                </Button>

            </Box>


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

                <TableContainer
                    component={Paper}
                    sx={{
                        borderColor: "divider",
                        overflowX: "auto"
                    }}
                >

                    <Table
                        size="small"
                        sx={{
                            minWidth: 850
                        }}
                    >

                        <TableHead>

                            <TableRow
                                sx={{
                                    backgroundColor:
                                        "action.hover"
                                }}
                            >

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            "text.secondary",
                                        whiteSpace:
                                            "nowrap"
                                    }}
                                >
                                    Supplier
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            "text.secondary",
                                        whiteSpace:
                                            "nowrap"
                                    }}
                                >
                                    Phone
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            "text.secondary",
                                        whiteSpace:
                                            "nowrap"
                                    }}
                                >
                                    Email
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            "text.secondary",
                                        whiteSpace:
                                            "nowrap"
                                    }}
                                >
                                    Address
                                </TableCell>

                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            "text.secondary",
                                        whiteSpace:
                                            "nowrap",
                                        width: 110
                                    }}
                                >
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        <TableBody>

                            {filteredSuppliers.length === 0 && (

                                <TableRow>

                                    <TableCell
                                        colSpan={5}
                                    >

                                        <Box
                                            sx={{
                                                py: 5,
                                                textAlign:
                                                    "center"
                                            }}
                                        >

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                No suppliers found.
                                            </Typography>

                                        </Box>

                                    </TableCell>

                                </TableRow>

                            )}


                            {filteredSuppliers.map(
                                supplier => (

                                    <TableRow
                                        key={
                                            supplier.supplierId
                                        }
                                        hover
                                        sx={{
                                            "&:last-child td": {
                                                borderBottom: 0
                                            }
                                        }}
                                    >

                                        <TableCell>

                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                sx={{
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {
                                                    supplier.name
                                                }
                                            </Typography>

                                        </TableCell>


                                        <TableCell>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {
                                                    supplier.phNo ||
                                                    "-"
                                                }
                                            </Typography>

                                        </TableCell>


                                        <TableCell>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {
                                                    supplier.email ||
                                                    "-"
                                                }
                                            </Typography>

                                        </TableCell>


                                        <TableCell>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    maxWidth: 320,
                                                    overflow:
                                                        "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {
                                                    supplier.address ||
                                                    "-"
                                                }
                                            </Typography>

                                        </TableCell>


                                        <TableCell
                                            align="center"
                                        >

                                            <Tooltip
                                                title="Edit Supplier"
                                            >

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Edit supplier"
                                                    onClick={() =>
                                                        handleOpenEdit(
                                                            supplier
                                                        )
                                                    }
                                                    sx={{
                                                        mr: 0.5
                                                    }}
                                                >

                                                    <EditRoundedIcon
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            <Tooltip
                                                title="Delete Supplier"
                                            >

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete supplier"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            supplier
                                                        )
                                                    }
                                                >

                                                    <DeleteRoundedIcon
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>

                                        </TableCell>

                                    </TableRow>

                                )
                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            )}


            {/* ADD / EDIT DIALOG */}

            <SupplierDialog
                open={dialogOpen}
                mode={dialogMode}
                value={formData}
                onChange={handleChange}
                onClose={() =>
                    setDialogOpen(false)
                }
                onSubmit={handleSubmit}
            />


            {/* DELETE DIALOG */}

            <DeleteSupplierDialog
                supplier={deleteTarget}
                onClose={() =>
                    setDeleteTarget(null)
                }
                onConfirm={handleDelete}
            />


            {/* SUCCESS SNACKBAR */}

            <Snackbar
                open={
                    Boolean(snackbar)
                }
                autoHideDuration={2500}
                onClose={() =>
                    setSnackbar("")
                }
                message={snackbar}
            />

        </Box>

    );

}


/* =========================================================
   SUPPLIER DIALOG
   ========================================================= */

function SupplierDialog({
    open,
    mode,
    value,
    onChange,
    onClose,
    onSubmit
}) {

    const isEdit =
        mode === "edit";


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden"
                }
            }}
        >

            <DialogTitle
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 2
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {isEdit
                        ? "Edit Supplier"
                        : "Add Supplier"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    {isEdit
                        ? "Update the supplier details below."
                        : "Enter the supplier details below."}
                </Typography>

            </DialogTitle>


            <Divider />


            <DialogContent
                sx={{
                    px: 3,
                    py: 3
                }}
            >

                <Stack spacing={2.5}>

                    <TextField
                        label="Supplier Name"
                        name="name"
                        value={value.name}
                        onChange={onChange}
                        fullWidth
                        required
                        helperText={
                            "Enter the supplier's name."
                        }
                    />


                    <TextField
                        label="Phone"
                        name="phNo"
                        value={value.phNo}
                        onChange={onChange}
                        fullWidth
                        helperText={
                            "Enter the supplier's contact number."
                        }
                    />


                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        value={value.email}
                        onChange={onChange}
                        fullWidth
                        helperText={
                            "Enter the supplier's email address."
                        }
                    />


                    <TextField
                        label="Address"
                        name="address"
                        value={value.address}
                        onChange={onChange}
                        fullWidth
                        multiline
                        minRows={3}
                        helperText={
                            "Enter the supplier's address."
                        }
                    />

                </Stack>

            </DialogContent>


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
                    sx={{
                        px: 2,
                        textTransform: "none"
                    }}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={
                        !value.name.trim()
                    }
                    sx={{
                        px: 2.5,
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    {isEdit
                        ? "Save Changes"
                        : "Add Supplier"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}


/* =========================================================
   DELETE DIALOG
   ========================================================= */

function DeleteSupplierDialog({
    supplier,
    onClose,
    onConfirm
}) {

    return (

        <Dialog
            open={Boolean(supplier)}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3
                }
            }}
        >

            <DialogTitle
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 1
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Delete Supplier
                </Typography>

            </DialogTitle>


            <DialogContent
                sx={{
                    px: 3,
                    py: 2
                }}
            >

                <Typography
                    color="text.secondary"
                >
                    Are you sure you want to delete{" "}

                    <Typography
                        component="span"
                        fontWeight={700}
                        color="text.primary"
                    >
                        {supplier?.name}
                    </Typography>

                    ?

                </Typography>

            </DialogContent>


            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1
                }}
            >

                <Button
                    onClick={onClose}
                    sx={{
                        px: 2,
                        textTransform: "none"
                    }}
                >
                    Cancel
                </Button>


                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    sx={{
                        px: 2.5,
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    );

}


export default Suppliers;