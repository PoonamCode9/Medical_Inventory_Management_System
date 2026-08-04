import { Box, Button, TextField } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

function MedicineToolbar({
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
                label="Search Medicines"
                placeholder="Search by medicine name..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                sx={{
                    minWidth: 300,
                    flexGrow: 1,
                    maxWidth: 500
                }}
            />

            <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={onAdd}
                sx={{
                    whiteSpace: "nowrap"
                }}
            >
                Add Medicine
            </Button>

        </Box>

    );

}

export default MedicineToolbar;