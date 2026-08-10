import { useEffect, useState } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import UserForm from "./UserForm";

import {
    createUser,
    updateUser
} from "../../services/userService";

function UserDialog({
    open,
    user,
    onClose,
    refreshUsers
}) {

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",
        roleId: 3

    });

    useEffect(() => {

        if (!open) {

            return;

        }

        if (user) {

            setFormData({

                name: user.name,
                email: user.email,
                password: "",
                roleId: user.roleId

            });

        }

        else {

            setFormData({

                name: "",
                email: "",
                password: "",
                roleId: 3

            });

        }

    }, [open, user]);

    const handleChange = (event) => {

        const {

            name,
            value

        } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]:

                name === "roleId"

                    ? Number(value)

                    : value

        }));

    };

    const handleSave = async () => {

        try {

            if (user) {

                await updateUser(

                    user.userId,

                    formData

                );

            }

            else {

                await createUser(formData);

            }

            await refreshUsers();

            onClose();

        }

        catch (error) {

            console.error(error);

            alert(

                user

                    ? "Failed to update user."

                    : "Failed to create user."

            );

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                {

                    user

                        ? "Edit User"

                        : "Add User"

                }

            </DialogTitle>

            <DialogContent>

                <UserForm

                    formData={formData}

                    onChange={handleChange}

                    isEdit={Boolean(user)}

                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >

                    Cancel

                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                >

                    {

                        user

                            ? "Update"

                            : "Create"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default UserDialog;