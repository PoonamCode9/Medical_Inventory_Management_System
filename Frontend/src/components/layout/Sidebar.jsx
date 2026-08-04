import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    const logout = () => {

        localStorage.clear();
        navigate("/");

    };

    const rolePath = role.toLowerCase();

    return (

        <Box
            sx={{
                width: 260,
                height: "100vh",
                backgroundColor: "#FFFFFF",
                borderRight: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* Logo */}

            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >

                <LocalPharmacyRoundedIcon
                    sx={{
                        color: "#1976D2",
                        fontSize: 34
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    MediStock
                </Typography>

            </Box>

            <Divider />

            {/* Navigation */}

            <List sx={{ px: 2, mt: 2 }}>

                <MenuItem
                    icon={<DashboardRoundedIcon />}
                    text="Dashboard"
                    to={`/${rolePath}/dashboard`}
                />

                <MenuItem
                    icon={<MedicationRoundedIcon />}
                    text="Medicines"
                    to={`/${rolePath}/medicines`}
                />

                <MenuItem
                    icon={<Inventory2RoundedIcon />}
                    text="Inventory"
                    to={`/${rolePath}/inventory`}
                />

                {/* ADMIN MENU */}

                {role === "ADMIN" && (

                    <>
                        <MenuItem
                            icon={<LocalShippingRoundedIcon />}
                            text="Suppliers"
                            to="/admin/suppliers"
                        />

                        <MenuItem
                            icon={<ShoppingCartRoundedIcon />}
                            text="Purchase Orders"
                            to="/admin/purchase-orders"
                        />

                        <MenuItem
                            icon={<PeopleRoundedIcon />}
                            text="Users"
                            to="/admin/users"
                        />

                        <MenuItem
                            icon={<AssessmentRoundedIcon />}
                            text="Reports"
                            to="/admin/reports"
                        />

                    </>

                )}

                {/* PHARMACIST MENU */}

                {role === "PHARMACIST" && (

                    <>
                        <MenuItem
                            icon={<LocalShippingRoundedIcon />}
                            text="Suppliers"
                            to="/pharmacist/suppliers"
                        />

                        <MenuItem
                            icon={<ShoppingCartRoundedIcon />}
                            text="Purchase Orders"
                            to="/pharmacist/purchase-orders"
                        />

                    </>

                )}

                {/* COMMON MENU */}

                <MenuItem
                    icon={<NotificationsRoundedIcon />}
                    text="Notifications"
                    to={`/${rolePath}/notifications`}
                />

            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider />

            {/* User Section */}

            <Box sx={{ p: 2 }}>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Logged in as
                </Typography>

                <Typography
                    fontWeight="600"
                    sx={{ mb: 2 }}
                >
                    {email}
                </Typography>

                <ListItemButton
                    onClick={logout}
                    sx={{
                        borderRadius: 2
                    }}
                >

                    <ListItemIcon>

                        <LogoutRoundedIcon color="error" />

                    </ListItemIcon>

                    <ListItemText primary="Logout" />

                </ListItemButton>

            </Box>

        </Box>

    );

}

function MenuItem({ icon, text, to }) {

    return (

        <ListItemButton

            component={NavLink}

            to={to}

            sx={{

                mb: 1,

                borderRadius: 2,

                "&.active": {

                    backgroundColor: "#1976D2",

                    color: "white",

                    "& .MuiListItemIcon-root": {

                        color: "white"

                    }

                }

            }}

        >

            <ListItemIcon>

                {icon}

            </ListItemIcon>

            <ListItemText primary={text} />

        </ListItemButton>

    );

}

export default Sidebar;