import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";

import DashboardRoundedIcon
    from "@mui/icons-material/DashboardRounded";

import MedicationRoundedIcon
    from "@mui/icons-material/MedicationRounded";

import Inventory2RoundedIcon
    from "@mui/icons-material/Inventory2Rounded";

import LocalShippingRoundedIcon
    from "@mui/icons-material/LocalShippingRounded";

import PeopleRoundedIcon
    from "@mui/icons-material/PeopleRounded";

import AssessmentRoundedIcon
    from "@mui/icons-material/AssessmentRounded";

import ShoppingCartRoundedIcon
    from "@mui/icons-material/ShoppingCartRounded";

import NotificationsRoundedIcon
    from "@mui/icons-material/NotificationsRounded";

import LogoutRoundedIcon
    from "@mui/icons-material/LogoutRounded";

import LocalPharmacyRoundedIcon
    from "@mui/icons-material/LocalPharmacyRounded";

import PointOfSaleRoundedIcon
    from "@mui/icons-material/PointOfSaleRounded";

import {
    NavLink,
    useNavigate
} from "react-router-dom";


function Sidebar() {

    const navigate = useNavigate();

    const role =
        localStorage.getItem("role");

    const email =
        localStorage.getItem("email");

    const logout = () => {

        localStorage.clear();

        navigate("/");

    };

    const rolePath =
        role?.toLowerCase() || "staff";


    return (

        <Box
            sx={{
                width: 260,
                height: "100vh",
                position: "sticky",
                top: 0,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                backgroundColor:
                    "background.paper",
                borderRight:
                    "1px solid",
                borderColor:
                    "divider",
                overflow: "hidden"
            }}
        >

            {/* BRAND */}

            <Box
                sx={{
                    height: 72,
                    px: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5
                }}
            >

                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                            "primary.main",
                        color:
                            "primary.contrastText"
                    }}
                >

                    <LocalPharmacyRoundedIcon
                        sx={{
                            fontSize: 25
                        }}
                    />

                </Box>


                <Box>

                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            lineHeight: 1.2,
                            color:
                                "text.primary"
                        }}
                    >
                        MediStock
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            color:
                                "text.secondary",
                            lineHeight: 1
                        }}
                    >
                        Inventory Management
                    </Typography>

                </Box>

            </Box>


            <Divider />


            {/* NAVIGATION */}

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    py: 2
                }}
            >

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        px: 3,
                        mb: 1,
                        color:
                            "text.secondary",
                        fontWeight: 700,
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            "0.08em"
                    }}
                >
                    Menu
                </Typography>


                <List
                    disablePadding
                    sx={{
                        px: 1.5
                    }}
                >

                    <MenuItem
                        icon={
                            <DashboardRoundedIcon />
                        }
                        text="Dashboard"
                        to={`/${rolePath}/dashboard`}
                    />


                    <MenuItem
                        icon={
                            <MedicationRoundedIcon />
                        }
                        text="Medicines"
                        to={`/${rolePath}/medicines`}
                    />


                    <MenuItem
                        icon={
                            <Inventory2RoundedIcon />
                        }
                        text="Inventory"
                        to={`/${rolePath}/inventory`}
                    />


                    {/* SALES */}

                    <MenuItem
                        icon={
                            <PointOfSaleRoundedIcon />
                        }
                        text="Sales"
                        to={`/${rolePath}/sales`}
                    />


                    {/* ADMIN */}

                    {role === "ADMIN" && (

                        <>

                            <MenuItem
                                icon={
                                    <LocalShippingRoundedIcon />
                                }
                                text="Suppliers"
                                to="/admin/suppliers"
                            />

                            <MenuItem
                                icon={
                                    <ShoppingCartRoundedIcon />
                                }
                                text="Purchase Orders"
                                to="/admin/purchase-orders"
                            />

                            <MenuItem
                                icon={
                                    <PeopleRoundedIcon />
                                }
                                text="Users"
                                to="/admin/users"
                            />

                            <MenuItem
                                icon={
                                    <AssessmentRoundedIcon />
                                }
                                text="Reports"
                                to="/admin/reports"
                            />

                        </>

                    )}


                    {/* PHARMACIST */}

                    {role === "PHARMACIST" && (

                        <>

                            <MenuItem
                                icon={
                                    <LocalShippingRoundedIcon />
                                }
                                text="Suppliers"
                                to="/pharmacist/suppliers"
                            />

                            <MenuItem
                                icon={
                                    <ShoppingCartRoundedIcon />
                                }
                                text="Purchase Orders"
                                to="/pharmacist/purchase-orders"
                            />

                        </>

                    )}


                    {/* COMMON */}

                    <MenuItem
                        icon={
                            <NotificationsRoundedIcon />
                        }
                        text="Notifications"
                        to={`/${rolePath}/notifications`}
                    />

                </List>

            </Box>


            <Divider />


            {/* USER / LOGOUT */}

            <Box
                sx={{
                    p: 2
                }}
            >

                <Box
                    sx={{
                        px: 1,
                        mb: 1.5
                    }}
                >

                    <Typography
                        variant="caption"
                        sx={{
                            color:
                                "text.secondary"
                        }}
                    >
                        Logged in as
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            color:
                                "text.primary",
                            overflow: "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {email || "User"}
                    </Typography>

                </Box>


                <ListItemButton
                    onClick={logout}
                    sx={{
                        minHeight: 44,
                        borderRadius: 2,
                        color: "error.main",
                        transition:
                            "all 0.15s ease",

                        "&:hover": {
                            backgroundColor:
                                "rgba(211, 47, 47, 0.06)"
                        }
                    }}
                >

                    <ListItemIcon
                        sx={{
                            minWidth: 40,
                            color: "error.main"
                        }}
                    >

                        <LogoutRoundedIcon
                            fontSize="small"
                        />

                    </ListItemIcon>

                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                            fontWeight: 600,
                            fontSize: "0.9rem"
                        }}
                    />

                </ListItemButton>

            </Box>

        </Box>

    );

}


function MenuItem({
    icon,
    text,
    to
}) {

    return (

        <ListItemButton
            component={NavLink}
            to={to}
            sx={{
                minHeight: 44,
                mb: 0.5,
                px: 1.5,
                borderRadius: 2,
                color: "text.secondary",
                transition:
                    "all 0.15s ease",

                "& .MuiListItemIcon-root": {
                    minWidth: 40,
                    color: "inherit"
                },

                "& .MuiListItemText-primary": {
                    fontSize: "0.9rem",
                    fontWeight: 600
                },

                "&:hover": {
                    backgroundColor:
                        "action.hover",
                    color:
                        "primary.main"
                },

                "&.active": {
                    backgroundColor:
                        "primary.main",
                    color:
                        "primary.contrastText",
                    boxShadow:
                        "0 2px 6px rgba(25, 118, 210, 0.20)"
                },

                "&.active .MuiListItemIcon-root": {
                    color:
                        "primary.contrastText"
                }
            }}
        >

            <ListItemIcon>
                {icon}
            </ListItemIcon>

            <ListItemText
                primary={text}
            />

        </ListItemButton>

    );

}


export default Sidebar;