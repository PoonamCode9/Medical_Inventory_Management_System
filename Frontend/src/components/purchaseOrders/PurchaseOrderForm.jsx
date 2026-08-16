import {
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";


function PurchaseOrderForm({
    formData,
    suppliers,
    medicines,
    errors,
    onChange
}) {

    return (

        <Grid
            container
            spacing={2}
            sx={{
                mt: 0.5
            }}
        >

            {/* SUPPLIER */}

            <Grid
                size={{
                    xs: 12,
                    sm: 6
                }}
            >

                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Supplier"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={onChange}
                    error={!!errors.supplierId}
                    helperText={errors.supplierId}
                >

                    {suppliers.map(
                        supplier => (

                            <MenuItem
                                key={
                                    supplier.supplierId
                                }
                                value={
                                    supplier.supplierId
                                }
                            >
                                {supplier.name}
                            </MenuItem>

                        )
                    )}

                </TextField>

            </Grid>


            {/* MEDICINE */}

            <Grid
                size={{
                    xs: 12,
                    sm: 6
                }}
            >

                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Medicine"
                    name="medicineId"
                    value={formData.medicineId}
                    onChange={onChange}
                    error={!!errors.medicineId}
                    helperText={errors.medicineId}
                >

                    {medicines.map(
                        medicine => (

                            <MenuItem
                                key={
                                    medicine.medicineId
                                }
                                value={
                                    medicine.medicineId
                                }
                            >
                                {medicine.name}
                            </MenuItem>

                        )
                    )}

                </TextField>

            </Grid>


            {/* QUANTITY */}

            <Grid
                size={{
                    xs: 12,
                    sm: 6
                }}
            >

                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onChange}
                    error={!!errors.quantity}
                    helperText={
                        errors.quantity ||
                        "Enter the number of units to order."
                    }
                    inputProps={{
                        min: 1
                    }}
                />

            </Grid>


            {/* EXPECTED DELIVERY */}

            <Grid
                size={{
                    xs: 12,
                    sm: 6
                }}
            >

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mb: 0.5,
                        color: "text.secondary",
                        fontWeight: 600
                    }}
                >
                    Expected Delivery
                </Typography>

                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    name="expectedDeliveryDate"
                    value={
                        formData.expectedDeliveryDate
                    }
                    onChange={onChange}
                    error={
                        !!errors.expectedDeliveryDate
                    }
                    helperText={
                        errors.expectedDeliveryDate
                    }
                    InputLabelProps={{
                        shrink: true
                    }}
                />

            </Grid>


            {/* STATUS */}

            <Grid
                size={{
                    xs: 12
                }}
            >

                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={onChange}
                    error={!!errors.status}
                    helperText={errors.status}
                >

                    <MenuItem value="PENDING">
                        Pending
                    </MenuItem>

                    <MenuItem value="APPROVED">
                        Approved
                    </MenuItem>

                    <MenuItem value="DELIVERED">
                        Delivered
                    </MenuItem>

                    <MenuItem value="CANCELLED">
                        Cancelled
                    </MenuItem>

                </TextField>

            </Grid>

        </Grid>

    );

}


export default PurchaseOrderForm;