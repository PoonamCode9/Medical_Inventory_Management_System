import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { Link as RouterLink } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import MedicationRoundedIcon
    from "@mui/icons-material/MedicationRounded";

import Inventory2RoundedIcon
    from "@mui/icons-material/Inventory2Rounded";

import WarningAmberRoundedIcon
    from "@mui/icons-material/WarningAmberRounded";

import AddRoundedIcon
    from "@mui/icons-material/AddRounded";

import WarehouseRoundedIcon
    from "@mui/icons-material/WarehouseRounded";

import StatCard
    from "../../components/dashboard/StatCard";

import RecentActivity
    from "../../components/dashboard/RecentActivity";

import {
    getAdminDashboardSummary
} from "../../services/dashboardService";


function StaffDashboard() {

    const email =
        localStorage.getItem("email");


    const [summary, setSummary] = useState({

        totalMedicines: 0,
        totalInventoryUnits: 0,
        lowStockMedicines: 0

    });


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadDashboard =
        useCallback(async () => {

            try {

                const summaryData =
                    await getAdminDashboardSummary();

                setSummary({

                    totalMedicines:
                        summaryData.totalMedicines ?? 0,

                    totalInventoryUnits:
                        summaryData.totalInventoryUnits ?? 0,

                    lowStockMedicines:
                        summaryData.lowStockMedicines ?? 0

                });

                setError("");

            } catch {

                setError(
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        const timer =
            setTimeout(loadDashboard, 0);

        const interval =
            setInterval(
                loadDashboard,
                15000
            );

        return () => {

            clearTimeout(timer);
            clearInterval(interval);

        };

    }, [loadDashboard]);


    const dashboardUpdates =
        useMemo(() => [

            "Dashboard synchronized successfully",

            `${summary.totalMedicines} medicines available`,

            `${summary.lowStockMedicines} medicines require restocking`

        ], [summary]);


    const displayValue =
        value =>
            loading ? "..." : value;


    return (

        <Box>

            {/* PAGE HEADER */}

            <Box sx={{ mb: 4 }}>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5
                    }}
                >
                    Welcome Back 👋
                </Typography>

                <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                        fontWeight: 600,
                        mb: 0.5
                    }}
                >
                    Staff
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    Manage medicines and monitor
                    inventory.
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Logged in as {email}
                </Typography>

            </Box>


            {/* ERROR */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}


            {/* STATISTICS */}

            <Grid
                container
                spacing={2.5}
            >

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >

                    <StatCard
                        title="Medicines"
                        value={
                            displayValue(
                                summary.totalMedicines
                            )
                        }
                        icon={
                            <MedicationRoundedIcon />
                        }
                        color="#1976D2"
                    />

                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >

                    <StatCard
                        title="Inventory"
                        value={
                            displayValue(
                                summary.totalInventoryUnits
                            )
                        }
                        icon={
                            <WarehouseRoundedIcon />
                        }
                        color="#6A1B9A"
                    />

                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >

                    <StatCard
                        title="Low Stock"
                        value={
                            displayValue(
                                summary.lowStockMedicines
                            )
                        }
                        icon={
                            <WarningAmberRoundedIcon />
                        }
                        color="#EF6C00"
                    />

                </Grid>

            </Grid>


            {/* QUICK ACTIONS */}

            <Paper
                sx={{
                    mt: 3,
                    p: {
                        xs: 2.5,
                        sm: 3
                    }
                }}
            >

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5
                    }}
                >
                    Quick Actions
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Quickly access commonly used
                    inventory tools.
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        flexWrap: "wrap"
                    }}
                >

                    <Button
                        component={RouterLink}
                        to="/staff/medicines"
                        variant="contained"
                        startIcon={
                            <AddRoundedIcon />
                        }
                    >
                        Medicines
                    </Button>


                    <Button
                        component={RouterLink}
                        to="/staff/inventory"
                        variant="outlined"
                        startIcon={
                            <Inventory2RoundedIcon />
                        }
                    >
                        Inventory
                    </Button>

                </Box>

            </Paper>


            {/* DASHBOARD WIDGETS */}

            <Grid
                container
                spacing={2.5}
                sx={{ mt: 0 }}
            >

                {/* RECENT ACTIVITY */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >

                    <RecentActivity
                        activities={
                            dashboardUpdates
                        }
                    />

                </Grid>


                {/* LOW STOCK */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >

                    <Paper
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 3
                            },
                            height: "100%"
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 0.5
                            }}
                        >
                            Low Stock Medicines
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                minHeight: 48,
                                mt: 1.5
                            }}
                        >
                            {loading

                                ? "Loading..."

                                : summary.lowStockMedicines === 0

                                    ? "No medicines are currently below the minimum stock."

                                    : `${summary.lowStockMedicines} medicine(s) require immediate restocking.`

                            }
                        </Typography>

                        <Button
                            component={RouterLink}
                            to="/staff/inventory"
                            variant="contained"
                            sx={{ mt: 2.5 }}
                        >
                            View Inventory
                        </Button>

                    </Paper>

                </Grid>


                {/* NOTIFICATIONS */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >

                    <Paper
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 3
                            },
                            height: "100%"
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 0.5
                            }}
                        >
                            Notifications
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                minHeight: 48,
                                mt: 1.5
                            }}
                        >
                            No new notifications.
                        </Typography>

                        <Button
                            component={RouterLink}
                            to="/staff/notifications"
                            variant="outlined"
                            sx={{ mt: 2.5 }}
                        >
                            View Notifications
                        </Button>

                    </Paper>

                </Grid>

            </Grid>

        </Box>

    );

}


export default StaffDashboard;