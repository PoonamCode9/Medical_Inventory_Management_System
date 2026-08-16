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

function SalesReportTable({
    records = []
}) {

    const formatCurrency = (value) => {

        const amount =
            Number(value || 0);

        return `₹${amount.toFixed(2)}`;

    };


    const formatDateTime = (value) => {

        if (!value) {

            return "—";

        }

        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return date.toLocaleString();

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
                    minWidth: 1250
                }}
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Sale ID</strong>
                        </TableCell>

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
                            <strong>Total Amount</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Sold By</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Sale Date</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {records.length === 0 ? (

                        <TableRow>

                            <TableCell
                                colSpan={9}
                                align="center"
                            >

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        py: 3
                                    }}
                                >

                                    No sales records found.

                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        records.map(
                            (sale) => (

                                <TableRow
                                    hover
                                    key={
                                        sale.saleId
                                    }
                                >

                                    {/* SALE ID */}

                                    <TableCell>

                                        {
                                            sale.saleId
                                        }

                                    </TableCell>


                                    {/* MEDICINE */}

                                    <TableCell>

                                        <Typography
                                            fontWeight={500}
                                        >

                                            {
                                                sale.medicineName
                                            }

                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >

                                            Category: {
                                                sale.category
                                                    || "—"
                                            }

                                        </Typography>

                                    </TableCell>


                                    {/* BATCH */}

                                    <TableCell>

                                        <Typography
                                            fontWeight={500}
                                        >

                                            {
                                                sale.batchNumber
                                                    || "—"
                                            }

                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >

                                            Batch ID: {
                                                sale.batchId
                                                    || "—"
                                            }

                                        </Typography>

                                    </TableCell>


                                    {/* CUSTOMER */}

                                    <TableCell>

                                        {
                                            sale.customerName
                                                || "Walk-in Customer"
                                        }

                                    </TableCell>


                                    {/* QUANTITY */}

                                    <TableCell align="center">

                                        {
                                            sale.quantity
                                                || 0
                                        }

                                    </TableCell>


                                    {/* UNIT PRICE */}

                                    <TableCell align="right">

                                        {
                                            formatCurrency(
                                                sale.unitPrice
                                            )
                                        }

                                    </TableCell>


                                    {/* TOTAL AMOUNT */}

                                    <TableCell align="right">

                                        <Typography
                                            fontWeight={600}
                                        >

                                            {
                                                formatCurrency(
                                                    sale.totalAmount
                                                )
                                            }

                                        </Typography>

                                    </TableCell>


                                    {/* SOLD BY */}

                                    <TableCell>

                                        <Typography
                                            fontWeight={500}
                                        >

                                            {
                                                sale.soldBy
                                                    || "—"
                                            }

                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >

                                            User ID: {
                                                sale.userId
                                                    || "—"
                                            }

                                        </Typography>

                                    </TableCell>


                                    {/* SALE DATE */}

                                    <TableCell>

                                        {
                                            formatDateTime(
                                                sale.saleDate
                                            )
                                        }

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


export default SalesReportTable;