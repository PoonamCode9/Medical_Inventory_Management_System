import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

import {
    deleteUser
} from "../../services/userService";

function DeleteUserDialog({
    open,
    user,
    onClose,
    refreshUsers
}) {

    const handleDelete = async () => {

        try {

            await deleteUser(user.userId);

            await refreshUsers();

            onClose();

        }

        catch (error) {

            console.error(error);

            alert("Failed to delete user.");

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>

                Delete User

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete

                    <strong>

                        {" "}

                        {user?.name}

                    </strong>

                    ?

                    <br />

                    This action cannot be undone.

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >

                    Cancel

                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default DeleteUserDialog;