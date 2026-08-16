import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import RefreshRoundedIcon
    from "@mui/icons-material/RefreshRounded";


function NotificationToolbar({
    searchTerm,
    onSearchChange,

    selectedAlertType,
    onAlertTypeChange,

    selectedStatus,
    onStatusChange,

    onRunCheck,
    showRunCheck

}) {

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
                flexWrap: "wrap"
            }}
        >

            {/* SEARCH */}

            <TextField
                label="Search Notifications"
                placeholder="Medicine, batch or category..."
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
                        sm: 260
                    },
                    maxWidth: 420
                }}
            />


            {/* ALERT TYPE */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 170
                }}
            >

                <InputLabel>
                    Alert Type
                </InputLabel>

                <Select
                    label="Alert Type"
                    value={selectedAlertType}
                    onChange={event =>
                        onAlertTypeChange(
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="ALL">
                        All
                    </MenuItem>

                    <MenuItem value="LOW_STOCK">
                        Low Stock
                    </MenuItem>

                    <MenuItem value="EXPIRING_SOON">
                        Expiring Soon
                    </MenuItem>

                    <MenuItem value="EXPIRED">
                        Expired
                    </MenuItem>

                </Select>

            </FormControl>


            {/* STATUS */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 150
                }}
            >

                <InputLabel>
                    Status
                </InputLabel>

                <Select
                    label="Status"
                    value={selectedStatus}
                    onChange={event =>
                        onStatusChange(
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="ALL">
                        All
                    </MenuItem>

                    <MenuItem value="ACTIVE">
                        Active
                    </MenuItem>

                    <MenuItem value="REVIEWED">
                        Reviewed
                    </MenuItem>

                    <MenuItem value="RESOLVED">
                        Resolved
                    </MenuItem>

                </Select>

            </FormControl>


            {/* RUN CHECK */}

            {showRunCheck && (

                <Button
                    variant="contained"
                    startIcon={
                        <RefreshRoundedIcon />
                    }
                    onClick={onRunCheck}
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
                    Run Check
                </Button>

            )}

        </Box>

    );

}


export default NotificationToolbar;