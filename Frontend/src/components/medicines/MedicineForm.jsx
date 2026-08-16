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

        <Grid
            container
            spacing={2.5}
            sx={{ pt: 0.5 }}
        >

            {/* MEDICINE NAME */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label="Medicine Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    error={!!errors.name}
                    helperText={
                        errors.name ||
                        "Enter the name of the medicine."
                    }
                />

            </Grid>


            {/* CATEGORY */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={onChange}
                    error={!!errors.category}
                    helperText={
                        errors.category ||
                        "Enter the medicine category."
                    }
                />

            </Grid>


            {/* PRICE */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    type="number"
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={onChange}
                    error={!!errors.price}
                    helperText={
                        errors.price ||
                        "Enter the price per unit."
                    }
                    slotProps={{
                        htmlInput: {
                            min: 0,
                            step: "0.01"
                        }
                    }}
                />

            </Grid>


            {/* SUPPLIER */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    select
                    fullWidth
                    label="Supplier"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={onChange}
                    error={!!errors.supplierId}
                    helperText={
                        errors.supplierId ||
                        "Select the medicine supplier."
                    }
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

        </Grid>

    );

}


export default MedicineForm;