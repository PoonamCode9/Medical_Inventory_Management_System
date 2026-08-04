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

function InventoryTable({
    inventory,
    role,
    onEdit,
    onDelete
}) {

    const getStatusChip = (status) => {

        switch (status) {

            case "HEALTHY":
                return (
                    <Chip
                        label="Healthy"
                        color="success"
                        size="small"
                    />
                );

            case "LOW_STOCK":
                return (
                    <Chip
                        label="Low Stock"
                        color="warning"
                        size="small"
                    />
                );

            case "EXPIRING_SOON":
                return (
                    <Chip
                        label="Expiring Soon"
                        color="info"
                        size="small"
                    />
                );

            case "EXPIRED":
                return (
                    <Chip
                        label="Expired"
                        color="error"
                        size="small"
                    />
                );

            default:
                return (
                    <Chip
                        label={status}
                        size="small"
                    />
                );

        }

    };

    if (inventory.length === 0) {

        return (

            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >

                <Typography color="text.secondary">
                    No inventory found.
                </Typography>

            </Paper>

        );

    }

    return (

        <TableContainer
            component={Paper}
            elevation={3}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Batch</strong>
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

                        <TableCell align="right">
                            <strong>Price</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Batch Value</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Mfg Date</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Exp Date</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Status</strong>
                        </TableCell>

                        {(role === "ADMIN" || role === "PHARMACIST") && (
                            <TableCell align="center">
                                <strong>Actions</strong>
                            </TableCell>
                        )}

                    </TableRow>

                </TableHead>

                <TableBody>

                    {inventory.map((item) => (

                        <TableRow
                            key={item.batchId}
                            hover
                        >

                            <TableCell>
                                {item.batchNumber}
                            </TableCell>

                            <TableCell>
                                {item.medicineName}
                            </TableCell>

                            <TableCell>
                                {item.category}
                            </TableCell>

                            <TableCell align="center">
                                {item.quantity}
                            </TableCell>

                            <TableCell align="right">
                                ₹{Number(item.medicinePrice).toFixed(2)}
                            </TableCell>

                            <TableCell align="right">
                                ₹{Number(item.batchValue).toFixed(2)}
                            </TableCell>

                            <TableCell>
                                {item.mfgDate}
                            </TableCell>

                            <TableCell>
                                {item.expDate}
                            </TableCell>

                            <TableCell align="center">
                                {getStatusChip(item.status)}
                            </TableCell>

                            {(role === "ADMIN" || role === "PHARMACIST") && (

                                <TableCell align="center">

                                    {onEdit && (

                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(item)}
                                        >

                                            <EditRoundedIcon />

                                        </IconButton>

                                    )}

                                    {role === "ADMIN" && onDelete && (

                                        <IconButton
                                            color="error"
                                            onClick={() => onDelete(item)}
                                        >

                                            <DeleteRoundedIcon />

                                        </IconButton>

                                    )}

                                </TableCell>

                            )}

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default InventoryTable;