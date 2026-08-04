import {
    Box,
    Button,
    Stack,
    TextField
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

function InventoryToolbar({
    searchTerm,
    onSearchChange,
    onAdd
}) {

    return (

        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{
                xs: "stretch",
                sm: "center"
            }}
            mb={3}
        >

            <TextField
                label="Search Medicine"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{
                    minWidth: {
                        xs: "100%",
                        sm: 300
                    }
                }}
            />

            <Box>

                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={onAdd}
                >
                    Add Inventory
                </Button>

            </Box>

        </Stack>

    );

}

export default InventoryToolbar;