import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

function MedicineReportTable({
    records = []
}) {

    return (

        <Box sx={{ mt: 4 }}>

            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2 }}
            >

                Medicine Records

            </Typography>

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
                        minWidth: 700
                    }}
                >

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <strong>ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Medicine</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Category</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Supplier</strong>
                            </TableCell>

                            <TableCell align="right">
                                <strong>Price</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {records.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                >

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            py: 3
                                        }}
                                    >

                                        No medicine records found.

                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            records.map(
                                (medicine) => (

                                    <TableRow
                                        hover
                                        key={
                                            medicine.medicineId
                                        }
                                    >

                                        <TableCell>
                                            {
                                                medicine.medicineId
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                medicine.name
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                medicine.category
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                medicine.supplierName
                                                    || "—"
                                            }
                                        </TableCell>

                                        <TableCell align="right">
                                            ₹
                                            {
                                                Number(
                                                    medicine.price
                                                ).toFixed(2)
                                            }
                                        </TableCell>

                                    </TableRow>

                                )
                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>

    );

}

export default MedicineReportTable;