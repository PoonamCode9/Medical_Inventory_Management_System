import {
    Box,
    Button,
    TextField
} from "@mui/material";

import AddRoundedIcon
    from "@mui/icons-material/AddRounded";


function InventoryToolbar({
    searchTerm,
    onSearchChange,
    onAdd
}) {

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 3,
                flexWrap: "wrap"
            }}
        >

            {/* SEARCH */}

            <TextField
                label="Search Inventory"
                placeholder="Search by medicine or batch..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={event =>
                    onSearchChange(
                        event.target.value
                    )
                }
                sx={{
                    minWidth: {
                        xs: "100%",
                        sm: 300
                    },
                    flexGrow: 1,
                    maxWidth: 500,

                    "& .MuiOutlinedInput-root": {
                        backgroundColor:
                            "background.paper"
                    }
                }}
            />


            {/* ADD INVENTORY */}

            <Button
                variant="contained"
                startIcon={
                    <AddRoundedIcon />
                }
                onClick={onAdd}
                sx={{
                    minHeight: 40,
                    px: 2.5,
                    borderRadius: 1,
                    whiteSpace: "nowrap",
                    textTransform: "none",
                    fontWeight: 600,
                    flexShrink: 0
                }}
            >
                Add Inventory
            </Button>

        </Box>

    );

}


export default InventoryToolbar;