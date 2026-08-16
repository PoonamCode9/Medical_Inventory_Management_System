import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {
        mode: "light",

        primary: {
            main: "#1976D2",
            dark: "#1565C0",
            light: "#42A5F5",
            contrastText: "#FFFFFF"
        },

        secondary: {
            main: "#64748B",
            dark: "#475569",
            light: "#94A3B8",
            contrastText: "#FFFFFF"
        },

        success: {
            main: "#2E7D32",
            dark: "#1B5E20",
            light: "#66BB6A"
        },

        warning: {
            main: "#ED6C02",
            dark: "#E65100",
            light: "#FF9800"
        },

        error: {
            main: "#D32F2F",
            dark: "#C62828",
            light: "#EF5350"
        },

        info: {
            main: "#0288D1",
            dark: "#01579B",
            light: "#29B6F6"
        },

        background: {
            default: "#F6F8FB",
            paper: "#FFFFFF"
        },

        text: {
            primary: "#1F2937",
            secondary: "#64748B"
        },

        divider: "#E2E8F0"
    },


    typography: {

        fontFamily: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            "Arial",
            "sans-serif"
        ].join(","),

        h1: {
            fontWeight: 700,
            letterSpacing: "-0.02em"
        },

        h2: {
            fontWeight: 700,
            letterSpacing: "-0.02em"
        },

        h3: {
            fontWeight: 700,
            letterSpacing: "-0.015em"
        },

        h4: {
            fontWeight: 700,
            letterSpacing: "-0.01em"
        },

        h5: {
            fontWeight: 700
        },

        h6: {
            fontWeight: 600
        },

        button: {
            fontWeight: 600,
            textTransform: "none"
        }
    },


    shape: {
        borderRadius: 10
    },


    shadows: [
        "none",
        "0 1px 2px rgba(15, 23, 42, 0.04)",
        "0 2px 6px rgba(15, 23, 42, 0.06)",
        "0 4px 12px rgba(15, 23, 42, 0.07)",
        "0 6px 18px rgba(15, 23, 42, 0.08)",
        "0 8px 24px rgba(15, 23, 42, 0.09)",
        "0 10px 30px rgba(15, 23, 42, 0.10)",
        "0 12px 36px rgba(15, 23, 42, 0.11)",
        "0 14px 42px rgba(15, 23, 42, 0.12)",
        "0 16px 48px rgba(15, 23, 42, 0.13)",
        "0 18px 54px rgba(15, 23, 42, 0.14)",
        "0 20px 60px rgba(15, 23, 42, 0.15)",
        "0 22px 66px rgba(15, 23, 42, 0.16)",
        "0 24px 72px rgba(15, 23, 42, 0.17)",
        "0 26px 78px rgba(15, 23, 42, 0.18)",
        "0 28px 84px rgba(15, 23, 42, 0.19)",
        "0 30px 90px rgba(15, 23, 42, 0.20)",
        "0 32px 96px rgba(15, 23, 42, 0.21)",
        "0 34px 102px rgba(15, 23, 42, 0.22)",
        "0 36px 108px rgba(15, 23, 42, 0.23)",
        "0 38px 114px rgba(15, 23, 42, 0.24)",
        "0 40px 120px rgba(15, 23, 42, 0.25)",
        "0 42px 126px rgba(15, 23, 42, 0.26)",
        "0 44px 132px rgba(15, 23, 42, 0.27)",
        "0 46px 138px rgba(15, 23, 42, 0.28)"
    ],


    components: {

        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F6F8FB"
                },

                "*": {
                    boxSizing: "border-box"
                }
            }
        },


        MuiButton: {

            defaultProps: {
                disableElevation: true
            },

            styleOverrides: {

                root: {
                    minHeight: 40,
                    borderRadius: 9,
                    paddingLeft: 18,
                    paddingRight: 18,
                    fontWeight: 600,
                    transition:
                        "all 0.2s ease"
                },

                containedPrimary: {
                    "&:hover": {
                        backgroundColor: "#1565C0"
                    }
                },

                outlined: {
                    borderColor: "#CBD5E1",

                    "&:hover": {
                        borderColor: "#1976D2",
                        backgroundColor:
                            "rgba(25, 118, 210, 0.04)"
                    }
                }
            }
        },


        MuiCard: {

            defaultProps: {
                elevation: 1
            },

            styleOverrides: {

                root: {
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF"
                }
            }
        },


        MuiPaper: {

            defaultProps: {
                elevation: 1
            },

            styleOverrides: {

                root: {
                    borderRadius: 12
                }
            }
        },


        MuiTextField: {

            defaultProps: {
                size: "small"
            }
        },


        MuiOutlinedInput: {

            styleOverrides: {

                root: {
                    borderRadius: 9,
                    backgroundColor: "#FFFFFF",

                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#94A3B8"
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 2
                    }
                },

                notchedOutline: {
                    borderColor: "#CBD5E1"
                }
            }
        },


        MuiInputLabel: {

            styleOverrides: {

                root: {
                    color: "#64748B"
                }
            }
        },


        MuiChip: {

            styleOverrides: {

                root: {
                    borderRadius: 7,
                    fontWeight: 600
                }
            }
        },


        MuiDialog: {

            styleOverrides: {

                paper: {
                    borderRadius: 14,
                    border: "1px solid #E2E8F0"
                }
            }
        },


        MuiDialogTitle: {

            styleOverrides: {

                root: {
                    padding: "22px 24px 16px",
                    fontWeight: 700
                }
            }
        },


        MuiDialogContent: {

            styleOverrides: {

                root: {
                    padding: "20px 24px"
                }
            }
        },


        MuiDialogActions: {

            styleOverrides: {

                root: {
                    padding: "14px 24px 20px"
                }
            }
        },


        MuiTableContainer: {

            styleOverrides: {

                root: {
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    overflow: "auto",
                    backgroundColor: "#FFFFFF"
                }
            }
        },


        MuiTableHead: {

            styleOverrides: {

                root: {
                    backgroundColor: "#F8FAFC"
                }
            }
        },


        MuiTableCell: {

            styleOverrides: {

                head: {
                    color: "#334155",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    borderBottom:
                        "1px solid #E2E8F0"
                },

                body: {
                    borderBottom:
                        "1px solid #F1F5F9",
                    color: "#334155"
                }
            }
        },


        MuiTableRow: {

            styleOverrides: {

                root: {
                    transition:
                        "background-color 0.15s ease",

                    "&:hover": {
                        backgroundColor:
                            "#F8FAFC"
                    },

                    "&:last-child td": {
                        borderBottom: 0
                    }
                }
            }
        },


        MuiTabs: {

            styleOverrides: {

                root: {
                    minHeight: 46
                },

                indicator: {
                    height: 3,
                    borderRadius: 3
                }
            }
        },


        MuiTab: {

            styleOverrides: {

                root: {
                    minHeight: 46,
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#64748B",

                    "&.Mui-selected": {
                        color: "#1976D2"
                    }
                }
            }
        },


        MuiTooltip: {

            styleOverrides: {

                tooltip: {
                    fontSize: "0.75rem",
                    borderRadius: 7
                }
            }
        },


        MuiAlert: {

            styleOverrides: {

                root: {
                    borderRadius: 10
                }
            }
        }
    }

});

export default theme;