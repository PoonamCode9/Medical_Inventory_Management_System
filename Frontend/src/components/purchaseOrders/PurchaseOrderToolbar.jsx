import {
    Box,
    Button,
    TextField
} from "@mui/material";

import AddRoundedIcon
    from "@mui/icons-material/AddRounded";


function PurchaseOrderToolbar({
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

            <TextField
                label="Search Purchase Orders"
                placeholder="Search by supplier, medicine, status or ID..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={event =>
                    onSearchChange(
                        event.target.value
                    )
                }
                sx={{
                    flexGrow: 1,
                    minWidth: {
                        xs: "100%",
                        sm: 300
                    },
                    maxWidth: 500
                }}
            />

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
                    textTransform: "none",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    flexShrink: 0
                }}
            >
                Add Purchase Order
            </Button>

        </Box>

    );

}


export default PurchaseOrderToolbar;