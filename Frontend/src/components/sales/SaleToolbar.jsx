import {
    Box,
    Button,
    TextField
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

function SaleToolbar({
    searchTerm,
    onSearchChange,
    onAdd
}) {

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
                width: "100%"
            }}
        >

            <TextField
                label="Search Sales"
                placeholder="Search by medicine, batch or customer..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                sx={{
                    flex: 1,
                    minWidth: 300
                }}
            />

            <Button
                variant="contained"
                startIcon={
                    <AddRoundedIcon />
                }
                onClick={onAdd}
                sx={{
                    whiteSpace: "nowrap",
                    borderRadius: 1,
                    px: 2.5
                }}
            >

                Record Sale

            </Button>

        </Box>

    );

}

export default SaleToolbar;