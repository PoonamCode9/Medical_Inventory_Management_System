import {
    Box,
    Button,
    TextField
} from "@mui/material";

import AddRoundedIcon
    from "@mui/icons-material/AddRounded";


function MedicineToolbar({
    role,
    searchTerm,
    onSearchChange,
    onAdd
}) {

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: {
                    xs: "stretch",
                    sm: "center"
                },
                justifyContent:
                    "space-between",
                gap: 1.5,
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
                onChange={event =>
                    onSearchChange(
                        event.target.value
                    )
                }
                fullWidth
                sx={{
                    flex: 1,
                    minWidth: {
                        xs: "100%",
                        sm: 280
                    },
                    maxWidth: {
                        xs: "100%",
                        sm: 500
                    }
                }}
                slotProps={{
                    input: {
                        sx: {
                            backgroundColor:
                                "background.paper"
                        }
                    }
                }}
            />


            {(role === "ADMIN" ||
                role === "PHARMACIST") && (

                <Button
                    variant="contained"
                    startIcon={
                        <AddRoundedIcon />
                    }
                    onClick={onAdd}
                    sx={{
                        minHeight: 40,
                        px: 2.5,
                        whiteSpace: "nowrap",
                        flexShrink: 0
                    }}
                >
                    Add Medicine
                </Button>

            )}

        </Box>

    );

}


export default MedicineToolbar;