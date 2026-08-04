import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {
        primary: {
            main: "#2563EB",
        },
        secondary: {
            main: "#3B82F6",
        },
        background: {
            default: "#F8FAFC",
        },
        success: {
            main: "#10B981",
        },
        warning: {
            main: "#F59E0B",
        },
        error: {
            main: "#EF4444",
        },
    },

    typography: {
        fontFamily: "Inter, sans-serif",
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 14,
    },

});

export default theme;