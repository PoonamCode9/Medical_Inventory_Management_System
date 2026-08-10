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

function SupplierReportTable({
    records = []
}) {

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
                    minWidth: 850
                }}
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Supplier ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Supplier Name</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Phone Number</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Email</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Address</strong>
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

                                    No supplier records found.

                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        records.map(
                            (supplier) => (

                                <TableRow
                                    hover
                                    key={
                                        supplier.supplierId
                                    }
                                >

                                    <TableCell>
                                        {
                                            supplier.supplierId
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            supplier.name
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            supplier.phNo
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            supplier.email
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            supplier.address
                                                || "—"
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

export default SupplierReportTable;