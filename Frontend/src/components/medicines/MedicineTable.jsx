import {
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

function MedicineTable({
    medicines,
    onEdit,
    onDelete
}) {

    if (medicines.length === 0) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >
                <Typography color="text.secondary">
                    No medicines found.
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
                            <strong>Name</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Category</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Price</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Supplier</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {medicines.map((medicine) => (

                        <TableRow
                            key={medicine.medicineId}
                            hover
                        >

                            <TableCell>
                                {medicine.name}
                            </TableCell>

                            <TableCell>
                                {medicine.category}
                            </TableCell>

                            <TableCell align="right">
                                ₹{Number(medicine.price).toFixed(2)}
                            </TableCell>

                            <TableCell>
                                {medicine.supplierName}
                            </TableCell>

                            <TableCell align="center">

                                {onEdit && (

                                    <IconButton
                                        color="primary"
                                        onClick={() => onEdit(medicine)}
                                    >
                                        <EditRoundedIcon />
                                    </IconButton>

                                )}

                                {onDelete && (

                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(medicine)}
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

export default MedicineTable;