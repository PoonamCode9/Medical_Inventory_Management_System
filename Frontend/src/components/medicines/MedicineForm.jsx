import {
    Grid,
    MenuItem,
    TextField
} from "@mui/material";

function MedicineForm({
    formData,
    suppliers,
    errors,
    onChange
}) {

    return (
        <Grid container spacing={2} sx={{ mt: 1 }}>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Medicine Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    error={!!errors.name}
                    helperText={errors.name}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={onChange}
                    error={!!errors.category}
                    helperText={errors.category}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    type="number"
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={onChange}
                    error={!!errors.price}
                    helperText={errors.price}
                />
            </Grid>

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

        </Grid>
    );
}

export default MedicineForm;