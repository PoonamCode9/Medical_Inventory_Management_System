import {
    Box,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

function LowStockTable({ medicines = [] }) {

    return (

        <Card elevation={2} sx={{ borderRadius: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Low Stock Medicines
                </Typography>

                <Table size="small">

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <b>Medicine</b>
                            </TableCell>

                            <TableCell>
                                <b>Supplier</b>
                            </TableCell>

                            <TableCell align="right">
                                <b>Stock</b>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {medicines.length === 0 && (

                            <TableRow>

                                <TableCell colSpan={3}>

                                    <Box sx={{ py: 4, textAlign: "center" }}>
                                        <Typography color="text.secondary">
                                            No low stock medicines.
                                        </Typography>
                                    </Box>

                                </TableCell>

                            </TableRow>

                        )}

                        {medicines.map((medicine) => (

                            <TableRow key={medicine.medicineId || medicine.name}>

                                <TableCell>
                                    {medicine.name}
                                </TableCell>

                                <TableCell>
                                    {medicine.supplierName || "No supplier"}
                                </TableCell>

                                <TableCell align="right">

                                    <Chip
                                        label={medicine.totalQuantity ?? 0}
                                        color="warning"
                                        size="small"
                                    />

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </CardContent>

        </Card>

    );

}

export default LowStockTable;
