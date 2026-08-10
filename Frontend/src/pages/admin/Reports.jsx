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
    Typography
} from "@mui/material";

import CloseRoundedIcon
    from "@mui/icons-material/CloseRounded";

import AnalyticsRoundedIcon
    from "@mui/icons-material/AnalyticsRounded";

import reportService
    from "../../services/reportService";

import {
    generatePdfReport,
    generateCsvReport,
    printReport,
    downloadBlob
} from "../../utils/reportExport";

import ReportToolbar
    from "../../components/reports/ReportToolbar";

import SummaryCards
    from "../../components/reports/SummaryCards";

import AnalyticsSection
    from "../../components/reports/AnalyticsSection";

import MedicineReportTable
    from "../../components/reports/MedicineReportTable";

import InventoryReportTable
    from "../../components/reports/InventoryReportTable";

import SupplierReportTable
    from "../../components/reports/SupplierReportTable";

import PurchaseOrderReportTable
    from "../../components/reports/PurchaseOrderReportTable";

import NotificationReportTable
    from "../../components/reports/NotificationReportTable";

import UserReportTable
    from "../../components/reports/UserReportTable";

import ActivityTable
    from "../../components/reports/ActivityTable";

import ActivityDetailsDialog
    from "../../components/reports/ActivityDetailsDialog";


const tabs = [
    "Overview",
    "Medicines",
    "Inventory",
    "Suppliers",
    "Purchases",
    "Notifications",
    "Users",
    "Activity History"
];


function Reports() {

    const [reportData, setReportData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [analyticsOpen, setAnalyticsOpen] =
        useState(false);

    const [selectedTab, setSelectedTab] =
        useState(0);

    const [selectedActivity, setSelectedActivity] =
        useState(null);

    const [activityDialogOpen, setActivityDialogOpen] =
        useState(false);


    const loadDashboard = async () => {

        try {

            setLoading(true);

            const data =
                await reportService
                    .getDashboardReport();

            setReportData(data);
            setError("");

        } catch (error) {

            console.error(
                "Reports Dashboard Error:",
                error
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


    const handleDownload = options => {

        if (!reportData) return;

        try {

            if (options.format === "PRINT") {

                printReport(
                    reportData,
                    options
                );

                return;
            }


            const blob =
                options.format === "PDF"
                    ? generatePdfReport(
                        reportData,
                        options
                    )
                    : generateCsvReport(
                        reportData,
                        options
                    );


            const extension =
                options.format === "PDF"
                    ? "pdf"
                    : "csv";


            downloadBlob(
                blob,
                `MediStock_Report_${options.period}.${extension}`
            );

        } catch (error) {

            console.error(
                "Report export failed:",
                error
            );

            alert(
                "Failed to generate the report."
            );

        }

    };


    const openAnalytics = () => {

        setSelectedTab(0);
        setAnalyticsOpen(true);

    };


    const closeAnalytics = () => {

        setAnalyticsOpen(false);

    };


    const viewActivity = activity => {

        setSelectedActivity(activity);
        setActivityDialogOpen(true);

    };


    const closeActivity = () => {

        setSelectedActivity(null);
        setActivityDialogOpen(false);

    };


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
            <Container
                maxWidth="xl"
                sx={{ py: 4 }}
            >
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );

    }


    if (!reportData) {

        return (
            <Container
                maxWidth="xl"
                sx={{ py: 4 }}
            >
                <Alert severity="warning">
                    No report data available.
                </Alert>
            </Container>
        );

    }


    const tableContent = [

        <MedicineReportTable
            records={
                reportData.medicineRecords || []
            }
        />,

        <InventoryReportTable
            records={
                reportData.inventoryRecords || []
            }
        />,

        <SupplierReportTable
            records={
                reportData.supplierRecords || []
            }
        />,

        <PurchaseOrderReportTable
            records={
                reportData.purchaseOrderRecords || []
            }
        />,

        <NotificationReportTable
            records={
                reportData.notificationRecords || []
            }
        />,

        <UserReportTable
            records={
                reportData.userRecords || []
            }
        />

    ];


    const analytics = [
        ["Medicine Analytics", reportData.medicines],
        ["Inventory Analytics", reportData.inventory],
        ["Supplier Analytics", reportData.suppliers],
        ["Purchase Analytics", reportData.purchaseOrders],
        ["Notification Analytics", reportData.notifications],
        ["User Analytics", reportData.users]
    ];


    return (

        <Container
            maxWidth="xl"
            sx={{ py: 4 }}
        >

            {/* HEADER */}

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
                        color="text.secondary"
                    >
                        Medical Inventory Management Platform
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        <AnalyticsRoundedIcon />
                    }
                    onClick={openAnalytics}
                    sx={{
                        mt: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    View Analytics
                </Button>

            </Box>


            {/* TOOLBAR */}

            <Box sx={{ mt: 3 }}>

                <ReportToolbar
                    onRefresh={loadDashboard}
                    onDownload={handleDownload}
                />

            </Box>


            {/* SUMMARY */}

            <SummaryCards
                summary={reportData.summary}
                inventory={reportData.inventory}
                suppliers={reportData.suppliers}
                purchaseOrders={
                    reportData.purchaseOrders
                }
                notifications={
                    reportData.notifications
                }
                users={reportData.users}
            />


            {/* ANALYTICS */}

            <Dialog
                open={analyticsOpen}
                onClose={closeAnalytics}
                fullWidth
                maxWidth="xl"
                scroll="paper"
            >

                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2
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
                        >
                            Detailed MediStock analytics
                            and database records.
                        </Typography>

                    </Box>


                    <IconButton
                        onClick={closeAnalytics}
                    >
                        <CloseRoundedIcon />
                    </IconButton>

                </DialogTitle>


                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        px: 3
                    }}
                >

                    <Tabs
                        value={selectedTab}
                        onChange={(_, value) =>
                            setSelectedTab(value)
                        }
                        variant="scrollable"
                        scrollButtons="auto"
                    >

                        {tabs.map(tab => (
                            <Tab
                                key={tab}
                                label={tab}
                            />
                        ))}

                    </Tabs>

                </Box>


                <DialogContent
                    dividers
                    sx={{ p: 3 }}
                >

                    {/* OVERVIEW */}

                    {selectedTab === 0 && (

                        <>

                            <SummaryCards
                                summary={
                                    reportData.summary
                                }
                                inventory={
                                    reportData.inventory
                                }
                                suppliers={
                                    reportData.suppliers
                                }
                                purchaseOrders={
                                    reportData.purchaseOrders
                                }
                                notifications={
                                    reportData.notifications
                                }
                                users={
                                    reportData.users
                                }
                            />

                            {analytics.map(
                                ([title, data]) => (
                                    <AnalyticsSection
                                        key={title}
                                        title={title}
                                        analytics={data}
                                    />
                                )
                            )}

                        </>

                    )}


                    {/* TABLE REPORTS */}

                    {selectedTab >= 1 &&
                        selectedTab <= 6 && (

                        <>

                            <AnalyticsSection
                                title={
                                    analytics[
                                        selectedTab - 1
                                    ][0]
                                }
                                analytics={
                                    analytics[
                                        selectedTab - 1
                                    ][1]
                                }
                            />

                            {tableContent[
                                selectedTab - 1
                            ]}

                        </>

                    )}


                    {/* ACTIVITY */}

                    {selectedTab === 7 && (

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
                                performed across MediStock.
                            </Typography>

                            <ActivityTable
                                activities={
                                    reportData
                                        .activityLogs || []
                                }
                                onView={viewActivity}
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

                    <Button
                        onClick={closeAnalytics}
                        sx={{
                            textTransform: "none"
                        }}
                    >
                        Close
                    </Button>

                </DialogActions>

            </Dialog>


            {/* ACTIVITY DETAILS */}

            <ActivityDetailsDialog
                open={activityDialogOpen}
                activity={selectedActivity}
                onClose={closeActivity}
            />

        </Container>

    );

}

export default Reports;