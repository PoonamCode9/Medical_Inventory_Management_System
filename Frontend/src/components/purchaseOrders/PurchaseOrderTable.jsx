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

import EditRoundedIcon
    from "@mui/icons-material/EditRounded";

import DeleteRoundedIcon
    from "@mui/icons-material/DeleteRounded";


const getStatusColor = status => {

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


const formatStatus = status => {

    if (!status) {
        return "";
    }

    return (
        status.charAt(0) +
        status.slice(1).toLowerCase()
    );

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
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2
                }}
            >

                <Typography
                    color="text.secondary"
                >
                    No purchase orders found.
                </Typography>

            </Paper>

        );

    }


    return (

        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 2,
                overflowX: "auto"
            }}
        >

            <Table
                size="small"
                sx={{
                    minWidth: 900,

                    "& .MuiTableCell-root": {
                        py: 1.25
                    }
                }}
            >

                <TableHead>

                    <TableRow
                        sx={{
                            backgroundColor:
                                "action.hover"
                        }}
                    >

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Supplier
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Medicine
                        </TableCell>


                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Quantity
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Expected Delivery
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Status
                        </TableCell>


                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            Total Amount
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace:
                                    "nowrap",
                                width: 110
                            }}
                        >
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {purchaseOrders.map(
                        purchaseOrder => (

                            <TableRow
                                key={
                                    purchaseOrder.orderId
                                }
                                hover
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >

                                {/* SUPPLIER */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            purchaseOrder.supplierName ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* MEDICINE */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            purchaseOrder.medicineName ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* QUANTITY */}

                                <TableCell
                                    align="right"
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            purchaseOrder.quantity
                                        }
                                    </Typography>

                                </TableCell>


                                {/* DELIVERY DATE */}

                                <TableCell>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            purchaseOrder.expectedDeliveryDate ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {/* STATUS */}

                                <TableCell
                                    align="center"
                                >

                                    <Chip
                                        label={
                                            formatStatus(
                                                purchaseOrder.status
                                            )
                                        }
                                        color={
                                            getStatusColor(
                                                purchaseOrder.status
                                            )
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            minWidth: 90
                                        }}
                                    />

                                </TableCell>


                                {/* TOTAL */}

                                <TableCell
                                    align="right"
                                >

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        ₹
                                        {Number(
                                            purchaseOrder.totalAmount
                                        ).toFixed(2)}
                                    </Typography>

                                </TableCell>


                                {/* ACTIONS */}

                                <TableCell
                                    align="center"
                                >

                                    {onEdit && (

                                        <IconButton
                                            size="small"
                                            color="primary"
                                            aria-label="Edit purchase order"
                                            onClick={() =>
                                                onEdit(
                                                    purchaseOrder
                                                )
                                            }
                                            sx={{
                                                mr: 0.5
                                            }}
                                        >

                                            <EditRoundedIcon
                                                fontSize="small"
                                            />

                                        </IconButton>

                                    )}


                                    {onDelete && (

                                        <IconButton
                                            size="small"
                                            color="error"
                                            aria-label="Delete purchase order"
                                            onClick={() =>
                                                onDelete(
                                                    purchaseOrder
                                                )
                                            }
                                        >

                                            <DeleteRoundedIcon
                                                fontSize="small"
                                            />

                                        </IconButton>

                                    )}

                                </TableCell>

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

}


export default PurchaseOrderTable;