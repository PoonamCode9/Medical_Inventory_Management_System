import {
    Box,
    Button,
    TextField
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

function PurchaseOrderToolbar({
    searchTerm,
    onSearchChange,
    onAdd
}) {

    return (

        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            mb={3}
            flexWrap="wrap"
        >

            <TextField
                label="Search Purchase Orders"
                value={searchTerm}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                sx={{
                    minWidth: 300
                }}
            />

            <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={onAdd}
            >
                Add Purchase Order
            </Button>

        </Box>

    );

}

export default PurchaseOrderToolbar;