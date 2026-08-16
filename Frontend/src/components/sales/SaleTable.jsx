import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

function SaleTable({
    sales
}) {

    if (sales.length === 0) {

        return (

            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >

                <Typography
                    color="text.secondary"
                >
                    No sales found.
                </Typography>

            </Paper>

        );

    }

    return (

        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 3,
                overflowX: "auto"
            }}
        >

            <Table
                size="small"
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Medicine</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Batch</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Customer</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Unit Price</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Sold By</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Date</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {sales.map((sale) => (

                        <TableRow
                            key={sale.saleId}
                            hover
                        >

                            <TableCell>

                                <Typography
                                    fontWeight={600}
                                    variant="body2"
                                >

                                    {sale.medicineName}

                                </Typography>

                                {sale.category && (

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >

                                        {sale.category}

                                    </Typography>

                                )}

                            </TableCell>


                            <TableCell>

                                {sale.batchNumber}

                            </TableCell>


                            <TableCell>

                                {sale.customerName ||
                                    "Walk-in Customer"}

                            </TableCell>


                            <TableCell align="center">

                                {sale.quantity}

                            </TableCell>


                            <TableCell align="right">

                                ₹
                                {Number(
                                    sale.unitPrice
                                ).toFixed(2)}

                            </TableCell>


                            <TableCell align="right">

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >

                                    ₹
                                    {Number(
                                        sale.totalAmount
                                    ).toFixed(2)}

                                </Typography>

                            </TableCell>


                            <TableCell>

                                {sale.soldBy}

                            </TableCell>


                            <TableCell>

                                {sale.saleDate
                                    ? new Date(
                                        sale.saleDate
                                    ).toLocaleDateString()
                                    : "-"}

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default SaleTable;