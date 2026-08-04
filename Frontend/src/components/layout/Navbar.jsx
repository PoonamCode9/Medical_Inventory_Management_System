import {
    AppBar,
    Avatar,
    Box,
    Toolbar,
    Typography
} from "@mui/material";

import { useLocation } from "react-router-dom";

function Navbar() {

    const name = localStorage.getItem("name");
    const location = useLocation();

    const pageTitle = getPageTitle(location.pathname);

    return (

        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: "white",
                color: "#111827",
                borderBottom: "1px solid #E5E7EB"
            }}
        >

            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    minHeight: 72,
                    px: 3
                }}
            >

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700
                    }}
                >
                    {pageTitle}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center"
                    }}
                >

                    <Avatar
                        sx={{
                            bgcolor: "#1976D2",
                            width: 42,
                            height: 42,
                            fontWeight: "bold"
                        }}
                    >
                        {name?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography
                        sx={{
                            ml: 2,
                            fontWeight: 500,
                            color: "#374151",
                            fontSize: "1rem"
                        }}
                    >
                        {name}
                    </Typography>

                </Box>

            </Toolbar>

        </AppBar>

    );

}

function getPageTitle(pathname) {

    if (pathname.includes("/medicines")) {
        return "Medicines";
    }

    if (pathname.includes("/suppliers")) {
        return "Suppliers";
    }

    if (pathname.includes("/inventory")) {
        return "Inventory";
    }

    if (pathname.includes("/users")) {
        return "Users";
    }

    if (pathname.includes("/reports")) {
        return "Reports";
    }

    if (pathname.includes("/purchase-orders")) {
        return "Purchase Orders";
    }

    if (pathname.includes("/notifications")) {
        return "Notifications";
    }

    return "Dashboard";
}

export default Navbar;