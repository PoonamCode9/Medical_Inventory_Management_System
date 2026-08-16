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

import EditRoundedIcon
    from "@mui/icons-material/EditRounded";

import DeleteRoundedIcon
    from "@mui/icons-material/DeleteRounded";


function MedicineTable({
    medicines,
    onEdit,
    onDelete
}) {

    const showActions =
        onEdit || onDelete;


    if (medicines.length === 0) {

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
                    No medicines found.
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
                    minWidth: 700,

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
                            Name
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
                            Category
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
                            Price
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
                            Supplier
                        </TableCell>


                        {showActions && (

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

                        )}

                    </TableRow>

                </TableHead>


                <TableBody>

                    {medicines.map(
                        medicine => (

                            <TableRow
                                key={
                                    medicine.medicineId
                                }
                                hover
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >

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
                                            medicine.name
                                        }
                                    </Typography>

                                </TableCell>


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
                                            medicine.category
                                        }
                                    </Typography>

                                </TableCell>


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
                                        ₹
                                        {Number(
                                            medicine.price
                                        ).toFixed(2)}
                                    </Typography>

                                </TableCell>


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
                                            medicine.supplierName ||
                                            "-"
                                        }
                                    </Typography>

                                </TableCell>


                                {showActions && (

                                    <TableCell
                                        align="center"
                                    >

                                        {onEdit && (

                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="Edit medicine"
                                                onClick={() =>
                                                    onEdit(
                                                        medicine
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
                                                aria-label="Delete medicine"
                                                onClick={() =>
                                                    onDelete(
                                                        medicine
                                                    )
                                                }
                                            >

                                                <DeleteRoundedIcon
                                                    fontSize="small"
                                                />

                                            </IconButton>

                                        )}

                                    </TableCell>

                                )}

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

}


export default MedicineTable;