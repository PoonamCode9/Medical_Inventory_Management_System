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

        <Grid
            container
            spacing={2.5}
            sx={{ pt: 0.5 }}
        >

            {/* MEDICINE */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    select
                    fullWidth
                    label="Medicine"
                    name="medicineId"
                    value={formData.medicineId}
                    onChange={onChange}
                    error={!!errors.medicineId}
                    helperText={
                        errors.medicineId ||
                        "Select the medicine for this batch."
                    }
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


            {/* BATCH NUMBER */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label="Batch Number"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={onChange}
                    error={!!errors.batchNumber}
                    helperText={
                        errors.batchNumber ||
                        "Enter the batch number."
                    }
                />

            </Grid>


            {/* QUANTITY */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onChange}
                    error={!!errors.quantity}
                    helperText={
                        errors.quantity ||
                        "Enter the available quantity."
                    }
                    slotProps={{
                        htmlInput: {
                            min: 1,
                            step: 1
                        }
                    }}
                />

            </Grid>


            {/* MANUFACTURING DATE */}

            <Grid
                size={{
                    xs: 12,
                    md: 6
                }}
            >

                <TextField
                    fullWidth
                    label="Manufacturing Date"
                    type="date"
                    name="mfgDate"
                    value={formData.mfgDate}
                    onChange={onChange}
                    error={!!errors.mfgDate}
                    helperText={
                        errors.mfgDate ||
                        "Select the manufacturing date."
                    }
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                />

            </Grid>


            {/* EXPIRY DATE */}

            <Grid
                size={{
                    xs: 12,
                    md: 6
                }}
            >

                <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    name="expDate"
                    value={formData.expDate}
                    onChange={onChange}
                    error={!!errors.expDate}
                    helperText={
                        errors.expDate ||
                        "Select the expiry date."
                    }
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