import {
    AppBar,
    Avatar,
    Box,
    Toolbar,
    Typography
} from "@mui/material";

import { useLocation } from "react-router-dom";


function Navbar() {

    const name =
        localStorage.getItem("name");

    const location =
        useLocation();

    const pageTitle =
        getPageTitle(location.pathname);

    const initial =
        name?.trim()?.charAt(0)?.toUpperCase() || "U";


    return (

        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: "background.paper",
                color: "text.primary",
                borderBottom:
                    "1px solid",
                borderColor: "divider"
            }}
        >

            <Toolbar
                sx={{
                    minHeight: {
                        xs: 64,
                        sm: 72
                    },
                    px: {
                        xs: 2,
                        sm: 3
                    },
                    justifyContent:
                        "space-between"
                }}
            >

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        fontSize: {
                            xs: "1.25rem",
                            sm: "1.5rem"
                        },
                        letterSpacing:
                            "-0.01em"
                    }}
                >
                    {pageTitle}
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >

                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor:
                                "primary.main",
                            color:
                                "primary.contrastText",
                            fontWeight: 700,
                            fontSize: "0.95rem"
                        }}
                    >
                        {initial}
                    </Avatar>


                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block"
                            }
                        }}
                    >

                        <Typography
                            sx={{
                                fontWeight: 600,
                                color:
                                    "text.primary",
                                fontSize:
                                    "0.9rem",
                                lineHeight: 1.3
                            }}
                        >
                            {name || "User"}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color:
                                    "text.secondary"
                            }}
                        >
                            MediStock
                        </Typography>

                    </Box>

                </Box>

            </Toolbar>

        </AppBar>

    );

}


function getPageTitle(pathname) {

    const pages = [

        ["/medicines", "Medicines"],

        ["/suppliers", "Suppliers"],

        ["/inventory", "Inventory"],

        ["/sales", "Sales"],

        ["/users", "Users"],

        ["/reports", "Reports"],

        ["/purchase-orders", "Purchase Orders"],

        ["/notifications", "Notifications"]

    ];

    return (
        pages.find(
            ([path]) =>
                pathname.includes(path)
        )?.[1] || "Dashboard"
    );

}


export default Navbar;