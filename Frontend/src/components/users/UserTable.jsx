import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

function UserTable({
    users,
    onEdit,
    onDelete
}) {

    const getRoleChip = (role) => {

        switch (role) {

            case "ADMIN":

                return (
                    <Chip
                        label="Admin"
                        color="error"
                        size="small"
                    />
                );

            case "PHARMACIST":

                return (
                    <Chip
                        label="Pharmacist"
                        color="primary"
                        size="small"
                    />
                );

            case "STAFF":

                return (
                    <Chip
                        label="Staff"
                        color="success"
                        size="small"
                    />
                );

            default:

                return (
                    <Chip
                        label={role}
                        size="small"
                    />
                );

        }

    };

    if (users.length === 0) {

        return (

            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >

                <Typography color="text.secondary">
                    No users found.
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
                            <strong>Email</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Role</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {users.map((user) => (

                        <TableRow
                            key={user.userId}
                            hover
                        >

                            <TableCell>
                                {user.name}
                            </TableCell>

                            <TableCell>
                                {user.email}
                            </TableCell>

                            <TableCell align="center">

                                {getRoleChip(user.roleName)}

                            </TableCell>

                            <TableCell align="center">

                                {onEdit && (

                                    <IconButton
                                        color="primary"
                                        onClick={() => onEdit(user)}
                                    >

                                        <EditRoundedIcon />

                                    </IconButton>

                                )}

                                {onDelete && (

                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(user)}
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

export default UserTable;