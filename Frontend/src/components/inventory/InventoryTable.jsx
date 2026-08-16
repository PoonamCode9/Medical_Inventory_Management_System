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


function InventoryTable({
    inventory,
    role,
    onEdit,
    onDelete
}) {

    const getStatusChip = status => {

        switch (status) {

            case "HEALTHY":

                return (
                    <Chip
                        label="Healthy"
                        color="success"
                        size="small"
                        sx={{
                            fontWeight: 600
                        }}
                    />
                );


            case "LOW_STOCK":

                return (
                    <Chip
                        label="Low Stock"
                        color="warning"
                        size="small"
                        sx={{
                            fontWeight: 600
                        }}
                    />
                );


            case "EXPIRING_SOON":

                return (
                    <Chip
                        label="Expiring Soon"
                        color="info"
                        size="small"
                        sx={{
                            fontWeight: 600
                        }}
                    />
                );


            case "EXPIRED":

                return (
                    <Chip
                        label="Expired"
                        color="error"
                        size="small"
                        sx={{
                            fontWeight: 600
                        }}
                    />
                );


            default:

                return (
                    <Chip
                        label={status || "Unknown"}
                        size="small"
                    />
                );

        }

    };


    if (inventory.length === 0) {

        return (

            <Paper
                sx={{
                    p: {
                        xs: 3,
                        sm: 4
                    },
                    textAlign: "center",
                    borderColor: "divider"
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    No inventory found.
                </Typography>

            </Paper>

        );

    }


    const showActions =
        role === "ADMIN" ||
        role === "PHARMACIST";


    return (

        <TableContainer
            component={Paper}
            sx={{
                overflowX: "auto",
                borderColor: "divider"
            }}
        >

            <Table
                size="small"
                sx={{
                    minWidth: 1100
                }}
            >

                {/* HEADER */}

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
                                whiteSpace: "nowrap"
                            }}
                        >
                            Batch
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Medicine
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Category
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Quantity
                        </TableCell>


                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Price
                        </TableCell>


                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Batch Value
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Mfg Date
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Exp Date
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color:
                                    "text.secondary",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Status
                        </TableCell>


                        {showActions && (

                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    color:
                                        "text.secondary",
                                    width: 110,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Actions
                            </TableCell>

                        )}

                    </TableRow>

                </TableHead>


                {/* BODY */}

                <TableBody>

                    {inventory.map(item => (

                        <TableRow
                            key={item.batchId}
                            hover
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    borderBottom: 0
                                }
                            }}
                        >

                            {/* BATCH */}

                            <TableCell>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {item.batchNumber}
                                </Typography>

                            </TableCell>


                            {/* MEDICINE */}

                            <TableCell>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {item.medicineName}
                                </Typography>

                            </TableCell>


                            {/* CATEGORY */}

                            <TableCell>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {item.category}
                                </Typography>

                            </TableCell>


                            {/* QUANTITY */}

                            <TableCell align="center">

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600
                                    }}
                                >
                                    {item.quantity}
                                </Typography>

                            </TableCell>


                            {/* PRICE */}

                            <TableCell align="right">

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    ₹
                                    {Number(
                                        item.medicinePrice
                                    ).toFixed(2)}
                                </Typography>

                            </TableCell>


                            {/* BATCH VALUE */}

                            <TableCell align="right">

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    ₹
                                    {Number(
                                        item.batchValue
                                    ).toFixed(2)}
                                </Typography>

                            </TableCell>


                            {/* MANUFACTURING DATE */}

                            <TableCell>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {item.mfgDate}
                                </Typography>

                            </TableCell>


                            {/* EXPIRY DATE */}

                            <TableCell>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {item.expDate}
                                </Typography>

                            </TableCell>


                            {/* STATUS */}

                            <TableCell align="center">

                                {getStatusChip(
                                    item.status
                                )}

                            </TableCell>


                            {/* ACTIONS */}

                            {showActions && (

                                <TableCell align="center">

                                    {onEdit && (

                                        <IconButton
                                            size="small"
                                            color="primary"
                                            aria-label="Edit inventory"
                                            onClick={() =>
                                                onEdit(item)
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


                                    {role === "ADMIN" &&
                                        onDelete && (

                                            <IconButton
                                                size="small"
                                                color="error"
                                                aria-label="Delete inventory"
                                                onClick={() =>
                                                    onDelete(item)
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

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}


export default InventoryTable;