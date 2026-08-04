import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

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
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
                alignItems: "center"
            }}
        >

            <TextField
                label="Search"
                placeholder="Medicine, Batch or Category"
                value={searchTerm}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                sx={{
                    minWidth: 260,
                    flex: 1
                }}
            />

            <FormControl sx={{ minWidth: 180 }}>

                <InputLabel>
                    Alert Type
                </InputLabel>

                <Select
                    label="Alert Type"
                    value={selectedAlertType}
                    onChange={(event) =>
                        onAlertTypeChange(event.target.value)
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

            <FormControl sx={{ minWidth: 180 }}>

                <InputLabel>
                    Status
                </InputLabel>

                <Select
                    label="Status"
                    value={selectedStatus}
                    onChange={(event) =>
                        onStatusChange(event.target.value)
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

            {
                showRunCheck
                &&
                (
                    <Button
                        variant="contained"
                        startIcon={<RefreshRoundedIcon />}
                        onClick={onRunCheck}
                        sx={{
                            height: 56,
                            px: 3
                        }}
                    >

                        Run Check

                    </Button>
                )
            }

        </Box>

    );

}

export default NotificationToolbar;
