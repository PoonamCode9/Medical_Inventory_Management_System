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

function UserReportTable({
    records = []
}) {

    const getRoleColor = (roleName) => {

        switch (roleName) {

            case "ADMIN":
                return "error";

            case "PHARMACIST":
                return "success";

            case "STAFF":
                return "primary";

            default:
                return "default";

        }

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
                    minWidth: 850
                }}
            >

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>User ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Name</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Email</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Role ID</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Role</strong>
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

                                    No user records found.

                                </Typography>

                            </TableCell>

                        </TableRow>

                    ) : (

                        records.map(
                            (user) => (

                                <TableRow
                                    hover
                                    key={
                                        user.userId
                                    }
                                >

                                    <TableCell>
                                        {
                                            user.userId
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            user.name
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            user.email
                                        }
                                    </TableCell>

                                    <TableCell align="center">
                                        {
                                            user.roleId
                                        }
                                    </TableCell>

                                    <TableCell align="center">

                                        <Chip
                                            label={
                                                user.roleName
                                            }
                                            color={
                                                getRoleColor(
                                                    user.roleName
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

export default UserReportTable;