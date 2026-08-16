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

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";


const COLORS = [
    "#1976d2",
    "#2e7d32",
    "#ed6c02",
    "#d32f2f",
    "#9c27b0",
    "#0288d1"
];


const countBy = (
    records = [],
    field
) =>
    records.reduce(
        (result, record) => {
            const key =
                record?.[field] || "Unknown";

            result[key] =
                (result[key] || 0) + 1;

            return result;
        },
        {}
    );


const toChartData = counts =>
    Object.entries(counts).map(
        ([name, value]) => ({
            name,
            value
        })
    );


const getSalesData = (
    salesRecords = []
) => {
    const transactions =
        salesRecords.length;

    const units =
        salesRecords.reduce(
            (total, sale) =>
                total +
                Number(
                    sale?.quantity || 0
                ),
            0
        );

    const revenue =
        salesRecords.reduce(
            (total, sale) =>
                total +
                Number(
                    sale?.totalAmount || 0
                ),
            0
        );

    return [
        {
            name: "Transactions",
            value: transactions
        },
        {
            name: "Units Sold",
            value: units
        },
        {
            name: "Revenue",
            value: Number(
                revenue.toFixed(2)
            )
        }
    ];
};


function ChartCard({
    title,
    children
}) {
    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 3
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    {title}
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        height: 280
                    }}
                >
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}


function EmptyChart() {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Typography color="text.secondary">
                No data available.
            </Typography>
        </Box>
    );
}


function ReportCharts({
    medicineRecords = [],
    inventoryRecords = [],
    purchaseOrderRecords = [],
    notificationRecords = [],
    salesRecords = []
}) {

    const medicineCategories =
        toChartData(
            countBy(
                medicineRecords,
                "category"
            )
        );


    const inventoryStatus =
        toChartData(
            countBy(
                inventoryRecords,
                "status"
            )
        );


    const purchaseStatus =
        toChartData(
            countBy(
                purchaseOrderRecords,
                "status"
            )
        );


    const notificationStatus =
        toChartData(
            countBy(
                notificationRecords,
                "status"
            )
        );


    const salesData =
        getSalesData(
            salesRecords
        );


    return (
        <Box sx={{ mb: 4 }}>

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 3 }}
            >
                Reports Overview
            </Typography>


            <Grid
                container
                spacing={3}
            >

                {/* MEDICINE CATEGORIES */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <ChartCard
                        title="Medicine Categories"
                    >
                        {medicineCategories.length ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={
                                        medicineCategories
                                    }
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
                                        name="Medicines"
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0
                                        ]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>
                </Grid>


                {/* INVENTORY STATUS */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <ChartCard
                        title="Inventory Status"
                    >
                        {inventoryStatus.length ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={
                                            inventoryStatus
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label
                                    >
                                        {inventoryStatus.map(
                                            (_, index) => (
                                                <Cell
                                                    key={
                                                        index
                                                    }
                                                    fill={
                                                        COLORS[
                                                            index %
                                                            COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />

                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>
                </Grid>


                {/* PURCHASE ORDERS */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <ChartCard
                        title="Purchase Order Status"
                    >
                        {purchaseStatus.length ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={
                                        purchaseStatus
                                    }
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

                                    <Legend />

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
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>
                </Grid>


                {/* NOTIFICATIONS */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <ChartCard
                        title="Notification Status"
                    >
                        {notificationStatus.length ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={
                                            notificationStatus
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label
                                    >
                                        {notificationStatus.map(
                                            (_, index) => (
                                                <Cell
                                                    key={
                                                        index
                                                    }
                                                    fill={
                                                        COLORS[
                                                            index %
                                                            COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />

                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>
                </Grid>


                {/* SALES */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <ChartCard
                        title="Sales Overview"
                    >
                        {salesRecords.length ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={salesData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 10,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="name"
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(
                                            value,
                                            name
                                        ) =>
                                            name ===
                                            "Revenue"
                                                ? [
                                                    `₹${Number(
                                                        value
                                                    ).toFixed(
                                                        2
                                                    )}`,
                                                    name
                                                ]
                                                : [
                                                    value,
                                                    name
                                                ]
                                        }
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="value"
                                        name="Sales"
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0
                                        ]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>
                </Grid>

            </Grid>

        </Box>
    );
}


export default ReportCharts;