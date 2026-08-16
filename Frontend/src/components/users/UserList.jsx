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

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");


    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState(null);


    const loadUsers = async () => {

        try {

            setLoading(true);

            const data =
                await getUsers();

            setUsers(
                data || []
            );

            setError("");

        } catch (err) {

            console.error(
                "Load Users Error:",
                err
            );

            setError(
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        const timer =
            setTimeout(
                loadUsers,
                0
            );

        return () =>
            clearTimeout(timer);

    }, []);


    const filteredUsers =
        users.filter(user => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            return (

                user.name
                    ?.toLowerCase()
                    .includes(search)

                ||

                user.email
                    ?.toLowerCase()
                    .includes(search)

                ||

                user.roleName
                    ?.toLowerCase()
                    .includes(search)

            );

        });


    const handleAdd = () => {

        setSelectedUser(null);
        setDialogOpen(true);

    };


    const handleEdit = user => {

        setSelectedUser(user);
        setDialogOpen(true);

    };


    const handleDelete = user => {

        setSelectedUser(user);
        setDeleteOpen(true);

    };


    return (

        <Box>

            {/* Page Header */}

            <Box
                sx={{
                    mb: 3
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                        letterSpacing: "-0.5px"
                    }}
                >
                    Users
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    Manage system users and their assigned roles.
                </Typography>

            </Box>


            {/* Error */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* Toolbar */}

            <UserToolbar
                searchTerm={searchTerm}
                onSearchChange={
                    setSearchTerm
                }
                onAdd={handleAdd}
            />


            {/* Users */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 220
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <UserTable
                    users={filteredUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}


            {/* Add / Edit */}

            <UserDialog
                open={dialogOpen}
                user={selectedUser}
                onClose={() =>
                    setDialogOpen(false)
                }
                refreshUsers={
                    loadUsers
                }
            />


            {/* Delete */}

            <DeleteUserDialog
                open={deleteOpen}
                user={selectedUser}
                onClose={() =>
                    setDeleteOpen(false)
                }
                refreshUsers={
                    loadUsers
                }
            />

        </Box>

    );

}


export default UserList;