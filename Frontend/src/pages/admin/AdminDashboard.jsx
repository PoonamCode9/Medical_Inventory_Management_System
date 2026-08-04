import { useCallback, useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";

import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";

import { getAdminDashboardSummary } from "../../services/dashboardService";

function AdminDashboard() {

    const email = localStorage.getItem("email");

    const [summary, setSummary] = useState({

        totalMedicines: 0,
        totalSuppliers: 0,
        totalInventoryUnits: 0,
        totalInventoryBatches: 0,
        totalInventoryValue: 0,
        lowStockMedicines: 0,
        expiringMedicines: 0,
        totalPurchaseOrders: 0,
        totalNotifications: 0

    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {

        try {

            const summaryData = await getAdminDashboardSummary();

            setSummary({

                totalMedicines: summaryData.totalMedicines ?? 0,
                totalSuppliers: summaryData.totalSuppliers ?? 0,
                totalInventoryUnits: summaryData.totalInventoryUnits ?? 0,
                totalInventoryBatches: summaryData.totalInventoryBatches ?? 0,
                totalInventoryValue: summaryData.totalInventoryValue ?? 0,
                lowStockMedicines: summaryData.lowStockMedicines ?? 0,
                expiringMedicines: summaryData.expiringMedicines ?? 0,
                totalPurchaseOrders: summaryData.totalPurchaseOrders ?? 0,
                totalNotifications: summaryData.totalNotifications ?? 0

            });

            setError("");

        } catch {

            setError("Unable to load dashboard data.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        const timer = setTimeout(() => {
            loadDashboard();
        }, 0);

        const interval = setInterval(loadDashboard, 15000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };

    }, [loadDashboard]);

    const dashboardUpdates = useMemo(() => [

        `${summary.totalMedicines} medicines available`,
        `${summary.totalInventoryUnits} units currently in stock`,
        `${summary.expiringMedicines} inventory batch(es) expiring soon`

    ], [summary]);

    const displayValue = (value) => loading ? "..." : value;

    return (

        <Box>

            {/* Header */}

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >

                Welcome Back 👋

            </Typography>

            <Typography
                variant="h6"
                color="primary"
                gutterBottom
            >

                Admin

            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
            >

                Logged in as {email}

            </Typography>

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >

                    {error}

                </Alert>

            )}

            {/* Statistics */}

            <Grid container spacing={3}>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>

                    <StatCard
                        title="Medicines"
                        value={displayValue(summary.totalMedicines)}
                        icon={<MedicationRoundedIcon />}
                        color="#1976D2"
                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>

                    <StatCard
                        title="Suppliers"
                        value={displayValue(summary.totalSuppliers)}
                        icon={<LocalShippingRoundedIcon />}
                        color="#2E7D32"
                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>

                    <StatCard
                        title="Inventory Batches"
                        value={displayValue(summary.totalInventoryBatches)}
                        icon={<WarehouseRoundedIcon />}
                        color="#6A1B9A"
                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>

                    <StatCard
                        title="Inventory Value"
                        value={
                            loading
                                ? "..."
                                : `₹${Number(summary.totalInventoryValue).toLocaleString()}`
                        }
                        icon={<ShoppingCartRoundedIcon />}
                        color="#00897B"
                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>

                    <StatCard
                        title="Low Stock"
                        value={displayValue(summary.lowStockMedicines)}
                        icon={<WarningAmberRoundedIcon />}
                        color="#EF6C00"
                    />

                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>

                    <StatCard
                        title="Expiring Soon"
                        value={displayValue(summary.expiringMedicines)}
                        icon={<NotificationsRoundedIcon />}
                        color="#D81B60"
                    />

                </Grid>

            </Grid>

            {/* Quick Actions */}

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    mt: 4
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >

                    Quick Actions

                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        mt: 2
                    }}
                >

                    <Button
                        component={RouterLink}
                        to="/admin/medicines"
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                    >
                        Medicines
                    </Button>

                    <Button
                        component={RouterLink}
                        to="/admin/suppliers"
                        variant="outlined"
                    >
                        Suppliers
                    </Button>

                    <Button
                        component={RouterLink}
                        to="/admin/inventory"
                        variant="outlined"
                        startIcon={<Inventory2RoundedIcon />}
                    >
                        Inventory
                    </Button>

                    <Button
                        component={RouterLink}
                        to="/admin/purchase-orders"
                        variant="outlined"
                        startIcon={<ShoppingCartRoundedIcon />}
                    >
                        Purchase Orders
                    </Button>

                </Box>

            </Paper>

                        {/* Dashboard Widgets */}

            <Box sx={{ mt: 4 }}>

                <Grid container spacing={3}>

                    {/* Recent Activity */}

                    <Grid size={{ xs: 12, md: 4 }}>

                        <RecentActivity
                            activities={dashboardUpdates}
                        />

                    </Grid>

                    {/* Low Stock Preview */}

                    <Grid size={{ xs: 12, md: 4 }}>

                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                height: "100%"
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                            >

                                Low Stock Medicines

                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 2 }}
                            >

                                {loading
                                    ? "Loading..."
                                    : summary.lowStockMedicines === 0
                                        ? "No medicines are currently below the minimum stock."
                                        : `${summary.lowStockMedicines} medicine(s) require immediate restocking.`}

                            </Typography>

                            <Button
                                component={RouterLink}
                                to="/admin/inventory"
                                variant="contained"
                                sx={{ mt: 3 }}
                            >

                                View Inventory

                            </Button>

                        </Paper>

                    </Grid>

                    {/* Expiring Medicines */}

                    <Grid size={{ xs: 12, md: 4 }}>

                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                height: "100%"
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                            >

                                Expiring Medicines

                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 2 }}
                            >

                                {loading
                                    ? "Loading..."
                                    : summary.expiringMedicines === 0
                                        ? "No medicines are expiring within the next 30 days."
                                        : `${summary.expiringMedicines} inventory batch(es) will expire within the next 30 days.`}

                            </Typography>

                            <Button
                                component={RouterLink}
                                to="/admin/inventory"
                                variant="outlined"
                                sx={{ mt: 3 }}
                            >

                                View Inventory

                            </Button>

                        </Paper>

                    </Grid>

                </Grid>

            </Box>

        </Box>

    );

}

export default AdminDashboard;
