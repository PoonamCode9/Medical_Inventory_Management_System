import {
    Box,
    Button,
    MenuItem,
    Stack,
    TextField
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

function ActivityToolbar({

    search = "",

    onSearchChange = () => {},

    module = "",

    onModuleChange = () => {},

    action = "",

    onActionChange = () => {},

    role = "",

    onRoleChange = () => {},

    onRefresh = () => {}

}) {

    return (

        <Stack

            direction={{

                xs: "column",

                md: "row"

            }}

            spacing={2}

        >

            <TextField

                label="Search"

                placeholder="Search activities..."

                value={search}

                onChange={(event) =>

                    onSearchChange(event.target.value)

                }

                fullWidth

            />

            <TextField

                select

                label="Module"

                value={module}

                onChange={(event) =>

                    onModuleChange(event.target.value)

                }

                sx={{ minWidth: 180 }}

            >

                <MenuItem value="">
                    All Modules
                </MenuItem>

                <MenuItem value="MEDICINE">
                    Medicine
                </MenuItem>

                <MenuItem value="SUPPLIER">
                    Supplier
                </MenuItem>

                <MenuItem value="INVENTORY">
                    Inventory
                </MenuItem>

                <MenuItem value="PURCHASE_ORDER">
                    Purchase Order
                </MenuItem>

                <MenuItem value="NOTIFICATION">
                    Notification
                </MenuItem>

                <MenuItem value="USER">
                    User
                </MenuItem>

            </TextField>

            <TextField

                select

                label="Action"

                value={action}

                onChange={(event) =>

                    onActionChange(event.target.value)

                }

                sx={{ minWidth: 180 }}

            >

                <MenuItem value="">
                    All Actions
                </MenuItem>

                <MenuItem value="CREATED">
                    Created
                </MenuItem>

                <MenuItem value="UPDATED">
                    Updated
                </MenuItem>

                <MenuItem value="DELETED">
                    Deleted
                </MenuItem>

                <MenuItem value="APPROVED">
                    Approved
                </MenuItem>

                <MenuItem value="DELIVERED">
                    Delivered
                </MenuItem>

                <MenuItem value="REVIEWED">
                    Reviewed
                </MenuItem>

                <MenuItem value="RESOLVED">
                    Resolved
                </MenuItem>

            </TextField>

            <TextField

                select

                label="Role"

                value={role}

                onChange={(event) =>

                    onRoleChange(event.target.value)

                }

                sx={{ minWidth: 180 }}

            >

                <MenuItem value="">
                    All Roles
                </MenuItem>

                <MenuItem value="ADMIN">
                    Admin
                </MenuItem>

                <MenuItem value="STAFF">
                    Staff
                </MenuItem>

                <MenuItem value="PHARMACIST">
                    Pharmacist
                </MenuItem>

            </TextField>

            <Box>

                <Button

                    variant="contained"

                    startIcon={<RefreshRoundedIcon />}

                    onClick={onRefresh}

                >

                    Refresh

                </Button>

            </Box>

        </Stack>

    );

}

export default ActivityToolbar;