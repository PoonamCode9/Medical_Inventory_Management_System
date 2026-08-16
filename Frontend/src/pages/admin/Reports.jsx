import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import reportService from "../../services/reportService";

import ReportToolbar from "../../components/reports/ReportToolbar";
import SummaryCards from "../../components/reports/SummaryCards";
import AnalyticsSection from "../../components/reports/AnalyticsSection";
import ReportCharts from "../../components/reports/ReportCharts";

import MedicineReportTable from "../../components/reports/MedicineReportTable";
import InventoryReportTable from "../../components/reports/InventoryReportTable";
import SupplierReportTable from "../../components/reports/SupplierReportTable";
import PurchaseOrderReportTable from "../../components/reports/PurchaseOrderReportTable";
import SalesReportTable from "../../components/reports/SalesReportTable";
import NotificationReportTable from "../../components/reports/NotificationReportTable";
import UserReportTable from "../../components/reports/UserReportTable";
import ActivityTable from "../../components/reports/ActivityTable";
import ActivityDetailsDialog from "../../components/reports/ActivityDetailsDialog";


function Reports() {

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityDialogOpen, setActivityDialogOpen] = useState(false);

    const [salesStartDate, setSalesStartDate] = useState("");
    const [salesEndDate, setSalesEndDate] = useState("");
    const [filteredSales, setFilteredSales] = useState(null);
    const [salesLoading, setSalesLoading] = useState(false);
    const [salesError, setSalesError] = useState("");


    /* =========================================================
       LOAD REPORT
       ========================================================= */

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const data =
                await reportService.getDashboardReport();

            setReportData(data);
            setError("");

            setFilteredSales(null);
            setSalesStartDate("");
            setSalesEndDate("");
            setSalesError("");

        } catch (err) {

            console.error(
                "Reports Dashboard Error:",
                err
            );

            setError(
                "Failed to load reports dashboard."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        loadDashboard();
    }, []);


    /* =========================================================
       SALES FILTER
       ========================================================= */

    const handleSalesFilter = async () => {

        setSalesError("");

        if (!salesStartDate || !salesEndDate) {

            setSalesError(
                "Please select both a start date and an end date."
            );

            return;

        }

        if (salesStartDate > salesEndDate) {

            setSalesError(
                "Start date cannot be after the end date."
            );

            return;

        }

        try {

            setSalesLoading(true);

            const sales =
                await reportService.getSalesBetweenDates(
                    salesStartDate,
                    salesEndDate
                );

            setFilteredSales(sales || []);

        } catch (err) {

            console.error(
                "Sales Filter Error:",
                err
            );

            setSalesError(
                "Failed to load sales for the selected date range."
            );

            setFilteredSales(null);

        } finally {

            setSalesLoading(false);

        }

    };


    const handleResetSalesFilter = () => {

        setSalesStartDate("");
        setSalesEndDate("");
        setFilteredSales(null);
        setSalesError("");

    };


    /* =========================================================
       EXPORT
       ========================================================= */

    const handleDownload = options => {

        try {

            switch (options.format) {

                case "PDF":
                    reportService.downloadPdfReport(
                        reportData,
                        options
                    );
                    break;

                case "XLSX":
                    reportService.downloadExcelReport(
                        reportData,
                        options
                    );
                    break;

                case "CSV":
                    reportService.downloadCsvReport(
                        reportData,
                        options
                    );
                    break;

                case "PRINT":
                    reportService.printReport(
                        reportData,
                        options
                    );
                    break;

                default:
                    throw new Error(
                        "Unsupported report format."
                    );

            }

        } catch (err) {

            console.error(
                "Report export failed:",
                err
            );

            window.alert(
                "Failed to generate the selected report."
            );

        }

    };


    /* =========================================================
       ANALYTICS
       ========================================================= */

    const handleOpenAnalytics = () => {
        setSelectedTab(0);
        setAnalyticsOpen(true);
    };

    const handleCloseAnalytics = () => {
        setAnalyticsOpen(false);
    };

    const handleTabChange = (_, value) => {
        setSelectedTab(value);
    };


    /* =========================================================
       ACTIVITY
       ========================================================= */

    const handleViewActivity = activity => {

        setSelectedActivity(activity);
        setActivityDialogOpen(true);

    };

    const handleCloseActivityDialog = () => {

        setActivityDialogOpen(false);
        setSelectedActivity(null);

    };


    /* =========================================================
       LOADING / ERROR
       ========================================================= */

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="70vh"
            >
                <CircularProgress />
            </Box>
        );

    }


    if (error) {

        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );

    }


    if (!reportData) {

        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="warning">
                    No report data available.
                </Alert>
            </Container>
        );

    }


    /* =========================================================
       SALES DATA
       ========================================================= */

    const salesRecords =
        filteredSales !== null
            ? filteredSales
            : reportData.salesRecords || [];


    const salesAnalytics = (() => {

        if (filteredSales === null) {
            return reportData.sales;
        }

        const totalTransactions =
            salesRecords.length;

        const totalUnitsSold =
            salesRecords.reduce(
                (total, sale) =>
                    total + Number(sale.quantity || 0),
                0
            );

        const totalRevenue =
            salesRecords.reduce(
                (total, sale) =>
                    total + Number(sale.totalAmount || 0),
                0
            );

        return {
            totalSales: totalTransactions,
            totalUnitsSold,
            totalRevenue,
            averageSaleValue:
                totalTransactions
                    ? totalRevenue / totalTransactions
                    : 0
        };

    })();


    /* =========================================================
       COMMON DATE FIELD STYLE
       ========================================================= */

    const dateFieldSx = {
        width: {
            xs: "100%",
            sm: 190
        },
        flex: {
            xs: "1 1 100%",
            sm: "0 1 190px"
        },
        minWidth: 0,

        "& .MuiInputBase-root": {
            height: 42
        },

        "& .MuiInputBase-input": {
            minWidth: 0,
            boxSizing: "border-box",
            fontSize: "0.9rem"
        },

        "& input::-webkit-date-and-time-value": {
            textAlign: "left"
        },

        "& input::-webkit-calendar-picker-indicator": {
            marginLeft: 4,
            cursor: "pointer"
        }
    };


    return (

        <Container
            maxWidth="xl"
            sx={{ py: 4 }}
        >

            {/* =====================================================
                PAGE HEADER
                ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 1,
                    flexWrap: "wrap"
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Reports Dashboard
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Medical Inventory Management Platform
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<AnalyticsRoundedIcon />}
                    onClick={handleOpenAnalytics}
                    sx={{
                        mt: 1,
                        borderRadius: 2,
                        whiteSpace: "nowrap"
                    }}
                >
                    View Analytics
                </Button>

            </Box>


            {/* =====================================================
                TOOLBAR
                ===================================================== */}

            <Box sx={{ mt: 3, mb: 3 }}>

                <ReportToolbar
                    onRefresh={loadDashboard}
                    onDownload={handleDownload}
                />

            </Box>


            {/* =====================================================
                SUMMARY
                ===================================================== */}

            <SummaryCards
                summary={reportData.summary}
            />


            {/* =====================================================
                ANALYTICS DIALOG
                ===================================================== */}

            <Dialog
                open={analyticsOpen}
                onClose={handleCloseAnalytics}
                fullWidth
                maxWidth="xl"
                scroll="paper"
            >

                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        pb: 1
                    }}
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Reports Analytics
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Review detailed MediStock
                            analytics and database records.
                        </Typography>

                    </Box>

                    <IconButton
                        onClick={handleCloseAnalytics}
                        aria-label="Close analytics"
                    >
                        <CloseRoundedIcon />
                    </IconButton>

                </DialogTitle>


                {/* =================================================
                    TABS
                    ================================================= */}

                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        px: 3
                    }}
                >

                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >

                        <Tab label="Overview" />
                        <Tab label="Medicines" />
                        <Tab label="Inventory" />
                        <Tab label="Suppliers" />
                        <Tab label="Purchases" />
                        <Tab label="Sales" />
                        <Tab label="Notifications" />
                        <Tab label="Users" />
                        <Tab label="Activity History" />

                    </Tabs>

                </Box>


                {/* =================================================
                    CONTENT
                    ================================================= */}

                <DialogContent
                    dividers
                    sx={{ p: 3 }}
                >

                    {/* =================================================
                        OVERVIEW
                        ================================================= */}

                    {selectedTab === 0 && (

                        <>

                            <SummaryCards
                                summary={reportData.summary}
                            />

                            <ReportCharts
                                medicineRecords={
                                    reportData.medicineRecords || []
                                }
                                inventoryRecords={
                                    reportData.inventoryRecords || []
                                }
                                purchaseOrderRecords={
                                    reportData.purchaseOrderRecords || []
                                }
                                notificationRecords={
                                    reportData.notificationRecords || []
                                }
                            />

                            <AnalyticsSection
                                title="Medicine Analytics"
                                analytics={reportData.medicines}
                            />

                            <AnalyticsSection
                                title="Inventory Analytics"
                                analytics={reportData.inventory}
                            />

                            <AnalyticsSection
                                title="Supplier Analytics"
                                analytics={reportData.suppliers}
                            />

                            <AnalyticsSection
                                title="Purchase Analytics"
                                analytics={reportData.purchaseOrders}
                            />

                            <AnalyticsSection
                                title="Sales Analytics"
                                analytics={reportData.sales}
                            />

                            <AnalyticsSection
                                title="Notification Analytics"
                                analytics={reportData.notifications}
                            />

                            <AnalyticsSection
                                title="User Analytics"
                                analytics={reportData.users}
                            />

                        </>

                    )}


                    {/* =================================================
                        MEDICINES
                        ================================================= */}

                    {selectedTab === 1 && (

                        <>
                            <AnalyticsSection
                                title="Medicine Analytics"
                                analytics={reportData.medicines}
                            />

                            <MedicineReportTable
                                records={
                                    reportData.medicineRecords || []
                                }
                            />
                        </>

                    )}


                    {/* =================================================
                        INVENTORY
                        ================================================= */}

                    {selectedTab === 2 && (

                        <>
                            <AnalyticsSection
                                title="Inventory Analytics"
                                analytics={reportData.inventory}
                            />

                            <InventoryReportTable
                                records={
                                    reportData.inventoryRecords || []
                                }
                            />
                        </>

                    )}


                    {/* =================================================
                        SUPPLIERS
                        ================================================= */}

                    {selectedTab === 3 && (

                        <>
                            <AnalyticsSection
                                title="Supplier Analytics"
                                analytics={reportData.suppliers}
                            />

                            <SupplierReportTable
                                records={
                                    reportData.supplierRecords || []
                                }
                            />
                        </>

                    )}


                    {/* =================================================
                        PURCHASE ORDERS
                        ================================================= */}

                    {selectedTab === 4 && (

                        <>
                            <AnalyticsSection
                                title="Purchase Analytics"
                                analytics={reportData.purchaseOrders}
                            />

                            <PurchaseOrderReportTable
                                records={
                                    reportData.purchaseOrderRecords || []
                                }
                            />
                        </>

                    )}


                    {/* =================================================
                        SALES
                        ================================================= */}

                    {selectedTab === 5 && (

                        <>

                            <AnalyticsSection
                                title="Sales Analytics"
                                analytics={salesAnalytics}
                            />


                            {/* SALES FILTER */}

                            <Box
                                sx={{
                                    mb: 3,
                                    p: 2.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    backgroundColor: "background.paper"
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 2
                                    }}
                                >

                                    <FilterAltRoundedIcon
                                        color="primary"
                                    />

                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                    >
                                        Filter Sales
                                    </Typography>

                                </Box>


                                {/* DATE CONTROLS */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        flexWrap: "wrap",
                                        width: "100%"
                                    }}
                                >

                                    <TextField
                                        label="Start Date"
                                        type="date"
                                        value={salesStartDate}
                                        onChange={e =>
                                            setSalesStartDate(
                                                e.target.value
                                            )
                                        }
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        size="small"
                                        sx={dateFieldSx}
                                    />


                                    <TextField
                                        label="End Date"
                                        type="date"
                                        value={salesEndDate}
                                        onChange={e =>
                                            setSalesEndDate(
                                                e.target.value
                                            )
                                        }
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        size="small"
                                        sx={dateFieldSx}
                                    />


                                    <Button
                                        variant="contained"
                                        startIcon={
                                            salesLoading
                                                ? (
                                                    <CircularProgress
                                                        size={18}
                                                        color="inherit"
                                                    />
                                                )
                                                : (
                                                    <FilterAltRoundedIcon />
                                                )
                                        }
                                        onClick={handleSalesFilter}
                                        disabled={salesLoading}
                                        sx={{
                                            borderRadius: 2,
                                            minWidth: 130,
                                            height: 42,
                                            flexShrink: 0
                                        }}
                                    >
                                        {salesLoading
                                            ? "Filtering..."
                                            : "Apply Filter"}
                                    </Button>


                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            <RefreshRoundedIcon />
                                        }
                                        onClick={handleResetSalesFilter}
                                        disabled={salesLoading}
                                        sx={{
                                            borderRadius: 2,
                                            minWidth: 90,
                                            height: 42,
                                            flexShrink: 0
                                        }}
                                    >
                                        Reset
                                    </Button>

                                </Box>


                                {salesError && (

                                    <Alert
                                        severity="error"
                                        sx={{ mt: 2 }}
                                    >
                                        {salesError}
                                    </Alert>

                                )}


                                {filteredSales !== null && (

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 2 }}
                                    >
                                        Showing{" "}
                                        <strong>
                                            {salesRecords.length}
                                        </strong>{" "}
                                        sales record
                                        {salesRecords.length !== 1
                                            ? "s"
                                            : ""}{" "}
                                        from{" "}
                                        <strong>
                                            {salesStartDate}
                                        </strong>{" "}
                                        to{" "}
                                        <strong>
                                            {salesEndDate}
                                        </strong>.
                                    </Typography>

                                )}

                            </Box>


                            <SalesReportTable
                                records={salesRecords}
                            />

                        </>

                    )}


                    {/* =================================================
                        NOTIFICATIONS
                        ================================================= */}

                    {selectedTab === 6 && (

                        <>
                            <AnalyticsSection
                                title="Notification Analytics"
                                analytics={reportData.notifications}
                            />

                            <NotificationReportTable
                                records={
                                    reportData.notificationRecords || []
                                }
                            />
                        </>

                    )}


                    {/* =================================================
                        USERS
                        ================================================= */}

                    {selectedTab === 7 && (

                        <>
                            <AnalyticsSection
                                title="User Analytics"
                                analytics={reportData.users}
                            />

                            <UserReportTable
                                records={
                                    reportData.userRecords || []
                                }
                            />
                        </>

                    )}


                    {/* =================================================
                        ACTIVITY HISTORY
                        ================================================= */}

                    {selectedTab === 8 && (

                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                            >
                                Activity History
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Complete history of actions
                                performed across the MediStock system.
                            </Typography>

                            <ActivityTable
                                activities={
                                    reportData.activityLogs || []
                                }
                                onView={handleViewActivity}
                            />

                        </Box>

                    )}

                </DialogContent>


                <DialogActions
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >

                    <Button onClick={handleCloseAnalytics}>
                        Close
                    </Button>

                </DialogActions>

            </Dialog>


            {/* =========================================================
                ACTIVITY DETAILS
                ========================================================= */}

            <ActivityDetailsDialog
                open={activityDialogOpen}
                activity={selectedActivity}
                onClose={handleCloseActivityDialog}
            />

        </Container>

    );

}


export default Reports;