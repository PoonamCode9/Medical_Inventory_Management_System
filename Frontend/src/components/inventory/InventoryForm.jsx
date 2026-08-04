import {
    Grid,
    MenuItem,
    TextField
} from "@mui/material";

function InventoryForm({
    formData,
    medicines,
    errors,
    onChange
}) {

    return (

        <Grid container spacing={2} sx={{ mt: 1 }}>

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
                    label="Batch Number"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={onChange}
                    error={!!errors.batchNumber}
                    helperText={errors.batchNumber}
                />

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

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Manufacturing Date"
                    type="date"
                    name="mfgDate"
                    value={formData.mfgDate}
                    onChange={onChange}
                    error={!!errors.mfgDate}
                    helperText={errors.mfgDate}
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                />

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    name="expDate"
                    value={formData.expDate}
                    onChange={onChange}
                    error={!!errors.expDate}
                    helperText={errors.expDate}
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                />

            </Grid>

        </Grid>

    );

}

export default InventoryForm;