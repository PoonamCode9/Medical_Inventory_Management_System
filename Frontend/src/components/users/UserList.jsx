import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import {
    getUsers
} from "../../services/userService";

import UserToolbar from "./UserToolbar";
import UserTable from "./UserTable";
import UserDialog from "./UserDialog";
import DeleteUserDialog from "./DeleteUserDialog";

function UserList() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {

        try {

            setLoading(true);

            const data = await getUsers();

            setUsers(data);

            setError("");

        }

        catch (err) {

            console.error(err);

            setError("Unable to load users.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        const timer = setTimeout(() => {

            loadUsers();

        }, 0);

        return () => clearTimeout(timer);

    }, []);

    const filteredUsers = users.filter((user) => {

        const search = searchTerm.toLowerCase();

        return (

            user.name
                .toLowerCase()
                .includes(search)

            ||

            user.email
                .toLowerCase()
                .includes(search)

            ||

            user.roleName
                .toLowerCase()
                .includes(search)

        );

    });

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                User Management
            </Typography>

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >

                    {error}

                </Alert>

            )}

            <UserToolbar

                searchTerm={searchTerm}

                onSearchChange={setSearchTerm}

                onAdd={() => {

                    setSelectedUser(null);

                    setDialogOpen(true);

                }}

            />

            {loading ? (

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={5}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <UserTable

                    users={filteredUsers}

                    onEdit={(user) => {

                        setSelectedUser(user);

                        setDialogOpen(true);

                    }}

                    onDelete={(user) => {

                        setSelectedUser(user);

                        setDeleteOpen(true);

                    }}

                />

            )}

            <UserDialog

                open={dialogOpen}

                user={selectedUser}

                onClose={() => setDialogOpen(false)}

                refreshUsers={loadUsers}

            />

            <DeleteUserDialog

                open={deleteOpen}

                user={selectedUser}

                onClose={() => setDeleteOpen(false)}

                refreshUsers={loadUsers}

            />

        </Box>

    );

}

export default UserList;