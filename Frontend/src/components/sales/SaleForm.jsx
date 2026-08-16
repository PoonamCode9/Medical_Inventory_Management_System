import {
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

function SaleForm({
    formData,
    inventory,
    errors,
    totalAmount,
    onChange
}) {

    const selectedInventory =
        inventory.find(
            (item) =>
                String(item.batchId) ===
                String(formData.batchId)
        );


    /*
     |--------------------------------------------------------------------------
     | Unit Price
     |--------------------------------------------------------------------------
     *
     * InventoryResponse uses "medicinePrice".
     *
     * We keep the value numeric here and only
     * format it for display below.
     */

    const unitPrice =
        selectedInventory?.medicinePrice ?? null;


    return (

        <Grid
            container
            spacing={2}
            sx={{ mt: 1 }}
        >

            {/* Inventory Batch */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    select
                    fullWidth
                    label="Medicine / Batch"
                    name="batchId"
                    value={formData.batchId}
                    onChange={onChange}
                    error={!!errors.batchId}
                    helperText={
                        errors.batchId ||
                        "Select the inventory batch being sold."
                    }
                >

                    {inventory.length === 0 ? (

                        <MenuItem disabled>
                            No inventory available
                        </MenuItem>

                    ) : (

                        inventory.map((item) => (

                            <MenuItem
                                key={item.batchId}
                                value={item.batchId}
                                disabled={
                                    Number(item.quantity) <= 0
                                }
                            >

                                {item.medicineName}
                                {" — Batch "}
                                {item.batchNumber}
                                {" — Stock: "}
                                {item.quantity}

                            </MenuItem>

                        ))

                    )}

                </TextField>

            </Grid>


            {/* Selected Medicine */}

            {selectedInventory && (

                <Grid size={{ xs: 12 }}>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        Medicine:{" "}
                        <strong>
                            {selectedInventory.medicineName}
                        </strong>

                        {"  •  "}

                        Batch:{" "}
                        <strong>
                            {selectedInventory.batchNumber}
                        </strong>

                    </Typography>

                </Grid>

            )}


            {/* Customer Name */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label="Customer Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={onChange}
                    placeholder="Enter customer name (optional)"
                />

            </Grid>


            {/* Quantity */}

            <Grid size={{ xs: 12, sm: 6 }}>

                <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onChange}
                    inputProps={{
                        min: 1,
                        max:
                            selectedInventory
                                ? selectedInventory.quantity
                                : undefined
                    }}
                    error={!!errors.quantity}
                    helperText={
                        errors.quantity ||
                        (
                            selectedInventory
                                ? `Available stock: ${selectedInventory.quantity}`
                                : ""
                        )
                    }
                />

            </Grid>


            {/* Unit Price */}

            <Grid size={{ xs: 12, sm: 6 }}>

                <TextField
                    fullWidth
                    label="Unit Price"
                    value={
                        unitPrice !== null
                            ? `₹${Number(
                                unitPrice
                            ).toFixed(2)}`
                            : ""
                    }
                    InputProps={{
                        readOnly: true
                    }}
                />

            </Grid>


            {/* Total Amount */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label="Total Amount"
                    value={`₹${Number(
                        totalAmount || 0
                    ).toFixed(2)}`}
                    InputProps={{
                        readOnly: true
                    }}
                    sx={{
                        "& .MuiInputBase-input": {
                            fontWeight: "bold"
                        }
                    }}
                />

            </Grid>

        </Grid>

    );

}

export default SaleForm;