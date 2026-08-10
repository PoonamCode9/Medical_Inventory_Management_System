import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

function InventoryReportTable({
    records = []
}) {

    const getStatusColor = (status) => {

        switch (status) {

            case "HEALTHY":
                return "success";

            case "LOW_STOCK":
                return "warning";

            case "EXPIRING_SOON":
                return "warning";

            case "EXPIRED":
                return "error";

            default:
                return "default";

        }

    };

    const formatCurrency = (value) => {

        const amount = Number(value || 0);

        return `₹${amount.toFixed(2)}`;

    };

    return (

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                borderRadius: 2,
                overflowX: "auto"
            }}
        >

            <Table
                sx={{
                    minWidth: 1100
                }}
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Batch ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Batch Number</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Medicine</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Category</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Mfg. Date</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Expiry Date</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Medicine Price</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Batch Value</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Status</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {records.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={10}
                                align="center"
                            >

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        py: 3
                                    }}
                                >

                                    No inventory records found.

                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        records.map(
                            (inventory) => (

                                <TableRow
                                    hover
                                    key={
                                        inventory.batchId
                                    }
                                >

                                    <TableCell>
                                        {
                                            inventory.batchId
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            inventory.batchNumber
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            inventory.medicineName
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            inventory.category
                                        }
                                    </TableCell>

                                    <TableCell align="center">
                                        {
                                            inventory.quantity
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            inventory.mfgDate
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            inventory.expDate
                                        }
                                    </TableCell>

                                    <TableCell align="right">
                                        {
                                            formatCurrency(
                                                inventory.medicinePrice
                                            )
                                        }
                                    </TableCell>

                                    <TableCell align="right">
                                        {
                                            formatCurrency(
                                                inventory.batchValue
                                            )
                                        }
                                    </TableCell>

                                    <TableCell align="center">

                                        <Chip
                                            label={
                                                inventory.status
                                            }
                                            color={
                                                getStatusColor(
                                                    inventory.status
                                                )
                                            }
                                            size="small"
                                        />

                                    </TableCell>

                                </TableRow>

                            )
                        )

                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default InventoryReportTable;