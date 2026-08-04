import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

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

const formatStatus = (status) => {

    if (!status) return "";

    return status.charAt(0) + status.slice(1).toLowerCase();

};

function PurchaseOrderTable({
    purchaseOrders,
    onEdit,
    onDelete
}) {

    if (purchaseOrders.length === 0) {

        return (

            <Paper
                elevation={2}
                sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    No Purchase Orders Found
                </Typography>

            </Paper>

        );

    }

    return (

        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 3
            }}
        >

            <Table>

                <TableHead>

                    <TableRow
                        sx={{
                            backgroundColor: "#f5f5f5"
                        }}
                    >

                        <TableCell>
                            <strong>Supplier</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Medicine</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Expected Delivery</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Total Amount</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {purchaseOrders.map((purchaseOrder, index) => (

                        <TableRow
                            key={purchaseOrder.orderId}
                            hover
                            sx={{
                                backgroundColor:
                                    index % 2 === 0
                                        ? "#ffffff"
                                        : "#fafafa",
                                transition: "0.2s"
                            }}
                        >

                            <TableCell>
                                {purchaseOrder.supplierName}
                            </TableCell>

                            <TableCell>
                                {purchaseOrder.medicineName}
                            </TableCell>

                            <TableCell align="right">
                                {purchaseOrder.quantity}
                            </TableCell>

                            <TableCell>
                                {purchaseOrder.expectedDeliveryDate}
                            </TableCell>

                            <TableCell align="center">

                                <Chip
                                    label={formatStatus(purchaseOrder.status)}
                                    color={getStatusColor(purchaseOrder.status)}
                                    variant="filled"
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        minWidth: 105
                                    }}
                                />

                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 600
                                }}
                            >
                                ₹{Number(
                                    purchaseOrder.totalAmount
                                ).toFixed(2)}
                            </TableCell>

                            <TableCell align="center">

                                {onEdit && (

                                    <IconButton
                                        color="primary"
                                        size="medium"
                                        onClick={() =>
                                            onEdit(purchaseOrder)
                                        }
                                    >
                                        <EditRoundedIcon />
                                    </IconButton>

                                )}

                                {onDelete && (

                                    <IconButton
                                        color="error"
                                        size="medium"
                                        onClick={() =>
                                            onDelete(purchaseOrder)
                                        }
                                    >
                                        <DeleteRoundedIcon />
                                    </IconButton>

                                )}

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default PurchaseOrderTable;