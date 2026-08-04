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
            sx={{ mt: 1 }}
        >

            <Grid size={{ xs: 12 }}>
                <TextField
                    select
                    fullWidth
                    label="Supplier"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={onChange}
                    error={!!errors.supplierId}
                    helperText={errors.supplierId}
                >
                    {suppliers.map((supplier) => (
                        <MenuItem
                            key={supplier.supplierId}
                            value={supplier.supplierId}
                        >
                            {supplier.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    select
                    fullWidth
                    label="Medicine"
                    name="medicineId"
                    value={formData.medicineId}
                    onChange={onChange}
                    error={!!errors.medicineId}
                    helperText={errors.medicineId}
                >
                    {medicines.map((medicine) => (
                        <MenuItem
                            key={medicine.medicineId}
                            value={medicine.medicineId}
                        >
                            {medicine.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onChange}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>

                <Typography
                    variant="body2"
                    sx={{
                        mb: 1,
                        color: "text.secondary",
                        fontWeight: 500
                    }}
                >
                    Expected Delivery
                </Typography>

                <TextField
                    fullWidth
                    type="date"
                    name="expectedDeliveryDate"
                    value={formData.expectedDeliveryDate}
                    onChange={onChange}
                    error={!!errors.expectedDeliveryDate}
                    helperText={errors.expectedDeliveryDate}
                />

            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    select
                    fullWidth
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