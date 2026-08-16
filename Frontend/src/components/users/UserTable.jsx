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


const getRoleChip = role => {

    const roles = {
        ADMIN: {
            label: "Admin",
            color: "error"
        },

        PHARMACIST: {
            label: "Pharmacist",
            color: "primary"
        },

        STAFF: {
            label: "Staff",
            color: "success"
        }
    };

    const config =
        roles[role] || {
            label: role || "Unknown",
            color: "default"
        };

    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            sx={{
                fontWeight: 600
            }}
        />
    );

};


function UserTable({
    users,
    onEdit,
    onDelete
}) {

    if (users.length === 0) {

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
                    No users found.
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
                                color: "text.secondary"
                            }}
                        >
                            Name
                        </TableCell>


                        <TableCell
                            sx={{
                                fontWeight: 700,
                                color: "text.secondary"
                            }}
                        >
                            Email
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color: "text.secondary",
                                width: 150
                            }}
                        >
                            Role
                        </TableCell>


                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color: "text.secondary",
                                width: 130
                            }}
                        >
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {users.map(user => (

                        <TableRow
                            key={user.userId}
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
                                >
                                    {user.name}
                                </Typography>

                            </TableCell>


                            <TableCell>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {user.email}
                                </Typography>

                            </TableCell>


                            <TableCell align="center">

                                {getRoleChip(
                                    user.roleName
                                )}

                            </TableCell>


                            <TableCell align="center">

                                {onEdit && (

                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() =>
                                            onEdit(user)
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
                                        color="error"
                                        size="small"
                                        onClick={() =>
                                            onDelete(user)
                                        }
                                    >

                                        <DeleteRoundedIcon
                                            fontSize="small"
                                        />

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


export default UserTable;