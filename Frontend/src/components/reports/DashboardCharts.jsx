import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";


function DashboardCharts({
    inventory,
    purchaseOrders
}) {

    const inventoryData = [

        {
            name: "Healthy",
            value: inventory?.healthyStock || 0
        },

        {
            name: "Low Stock",
            value: inventory?.lowStock || 0
        },

        {
            name: "Expiring Soon",
            value: inventory?.expiringSoon || 0
        },

        {
            name: "Expired",
            value: inventory?.expiredStock || 0
        }

    ];


    const purchaseData = [

        {
            name: "Pending",
            value:
                purchaseOrders?.pendingOrders || 0
        },

        {
            name: "Approved",
            value:
                purchaseOrders?.approvedOrders || 0
        },

        {
            name: "Delivered",
            value:
                purchaseOrders?.deliveredOrders || 0
        },

        {
            name: "Cancelled",
            value:
                purchaseOrders?.cancelledOrders || 0
        }

    ];


    const inventoryColors = [
        "#2E7D32",
        "#1976D2",
        "#ED6C02",
        "#D32F2F"
    ];


    return (

        <Grid
            container
            spacing={3}
            sx={{ mb: 4 }}
        >

            {/* ========================================================= */}
            {/* INVENTORY HEALTH */}
            {/* ========================================================= */}

            <Grid
                item
                xs={12}
                md={6}
            >

                <Card
                    elevation={3}
                    sx={{
                        height: "100%",
                        borderRadius: 3
                    }}
                >

                    <CardContent
                        sx={{ p: 3 }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                        >
                            Inventory Health
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Current condition of all
                            inventory batches.
                        </Typography>


                        <Box
                            sx={{
                                width: "100%",
                                height: 300
                            }}
                        >

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>

                                    <Pie
                                        data={inventoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={95}
                                        innerRadius={55}
                                        paddingAngle={3}
                                        label
                                    >

                                        {
                                            inventoryData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={
                                                            entry.name
                                                        }
                                                        fill={
                                                            inventoryColors[
                                                                index
                                                            ]
                                                        }
                                                    />

                                                )
                                            )
                                        }

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </Box>

                    </CardContent>

                </Card>

            </Grid>


            {/* ========================================================= */}
            {/* PURCHASE ORDERS */}
            {/* ========================================================= */}

            <Grid
                item
                xs={12}
                md={6}
            >

                <Card
                    elevation={3}
                    sx={{
                        height: "100%",
                        borderRadius: 3
                    }}
                >

                    <CardContent
                        sx={{ p: 3 }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                        >
                            Purchase Order Status
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Current status of all
                            purchase orders.
                        </Typography>


                        <Box
                            sx={{
                                width: "100%",
                                height: 300
                            }}
                        >

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={purchaseData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="name"
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="value"
                                        name="Orders"
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0
                                        ]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </Box>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>

    );

}

export default DashboardCharts;