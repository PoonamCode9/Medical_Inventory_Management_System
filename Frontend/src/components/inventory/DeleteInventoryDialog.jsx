import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

import { deleteInventory } from "../../services/inventoryService";

function DeleteInventoryDialog({
    open,
    inventory,
    onClose,
    refreshInventory
}) {

    const handleDelete = async () => {

        try {

            await deleteInventory(inventory.batchId);

            await refreshInventory();

            onClose();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
        >

            <DialogTitle>
                Delete Inventory
            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete batch

                    <strong>
                        {" "}{inventory?.batchNumber}
                    </strong>

                    ?

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default DeleteInventoryDialog;