import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography
} from "@mui/material";

import UserForm from "./UserForm";

import {
    createUser,
    updateUser
} from "../../services/userService";


const initialFormData = {
    name: "",
    email: "",
    password: "",
    roleId: 3
};


function UserDialog({
    open,
    user,
    onClose,
    refreshUsers
}) {

    const [formData, setFormData] =
        useState(initialFormData);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (!open) {
            return;
        }

        setError("");

        if (user) {

            setFormData({

                name: user.name || "",
                email: user.email || "",
                password: "",
                roleId: user.roleId

            });

        } else {

            setFormData({
                ...initialFormData
            });

        }

    }, [open, user]);


    const handleChange = event => {

        const {
            name,
            value
        } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]:
                name === "roleId"
                    ? Number(value)
                    : value
        }));

    };


    const handleSave = async () => {

        setLoading(true);
        setError("");

        try {

            if (user) {

                await updateUser(
                    user.userId,
                    formData
                );

            } else {

                await createUser(
                    formData
                );

            }

            await refreshUsers();

            onClose();

        } catch (error) {

            console.error(
                "User Save Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                (
                    user
                        ? "Failed to update user."
                        : "Failed to create user."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    const isEdit =
        Boolean(user);


    return (

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden"
                }
            }}
        >

            <DialogTitle
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 2
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {isEdit
                        ? "Edit User"
                        : "Add User"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    {isEdit
                        ? "Update the user's account details and role."
                        : "Create a new user account and assign a role."}
                </Typography>

            </DialogTitle>


            <Divider />


            <DialogContent
                sx={{
                    px: 3,
                    py: 3
                }}
            >

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2.5,
                            borderRadius: 2
                        }}
                    >
                        {error}
                    </Alert>

                )}


                <UserForm
                    formData={formData}
                    onChange={handleChange}
                    isEdit={isEdit}
                />

            </DialogContent>


            <Divider />


            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1
                }}
            >

                <Button
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        px: 2,
                        textTransform: "none"
                    }}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                        minWidth: 90,
                        px: 2.5,
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >

                    {loading ? (

                        <CircularProgress
                            size={21}
                            color="inherit"
                        />

                    ) : (

                        isEdit
                            ? "Update"
                            : "Create"

                    )}

                </Button>

            </DialogActions>

        </Dialog>

    );

}


export default UserDialog;