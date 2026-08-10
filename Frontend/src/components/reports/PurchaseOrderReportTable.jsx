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

function PurchaseOrderReportTable({
    records = []
}) {

    const getStatusColor = (status) => {

        switch (status) {

            case "PENDING":
                return "warning";

            case "APPROVED":
                return "info";

            case "DELIVERED":
                return "success";

            case "CANCELLED":
                return "error";

            default:
                return "default";

        }

    };

    const formatCurrency = (value) => {

        const amount = Number(value || 0);

        return `₹${amount.toFixed(2)}`;

    };

    const formatDateTime = (value) => {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
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
                    minWidth: 1150
                }}
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Order ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Medicine</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Supplier</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total Amount</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Order Date</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Expected Delivery</strong>
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
                                colSpan={8}
                                align="center"
                            >

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        py: 3
                                    }}
                                >

                                    No purchase order records found.

                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        records.map(
                            (order) => (

                                <TableRow
                                    hover
                                    key={
                                        order.orderId
                                    }
                                >

                                    <TableCell>
                                        {
                                            order.orderId
                                        }
                                    </TableCell>

                                    <TableCell>

                                        <Typography
                                            fontWeight={500}
                                        >

                                            {
                                                order.medicineName
                                            }

                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >

                                            Medicine ID: {
                                                order.medicineId
                                            }

                                        </Typography>

                                    </TableCell>

                                    <TableCell>

                                        <Typography
                                            fontWeight={500}
                                        >

                                            {
                                                order.supplierName
                                            }

                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >

                                            Supplier ID: {
                                                order.supplierId
                                            }

                                        </Typography>

                                    </TableCell>

                                    <TableCell align="center">
                                        {
                                            order.quantity
                                        }
                                    </TableCell>

                                    <TableCell align="right">
                                        {
                                            formatCurrency(
                                                order.totalAmount
                                            )
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            formatDateTime(
                                                order.orderDate
                                            )
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            order.expectedDeliveryDate
                                                || "—"
                                        }
                                    </TableCell>

                                    <TableCell align="center">

                                        <Chip
                                            label={
                                                order.status
                                            }
                                            color={
                                                getStatusColor(
                                                    order.status
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

export default PurchaseOrderReportTable;