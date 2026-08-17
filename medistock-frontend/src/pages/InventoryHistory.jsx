import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function InventoryChart() {

    // -----------------------------
    // 1. INVENTORY BY CATEGORY
    // -----------------------------

    const categoryData = {

        labels: [
            "Antibiotics",
            "Pain Relief",
            "Diabetes",
            "Gastric",
            "Supplements"
        ],

        datasets: [
            {
                label: "Medicines",

                data: [
                    8,
                    5,
                    3,
                    6,
                    4
                ],

                backgroundColor: [
                    "#2563eb",
                    "#06b6d4",
                    "#22c55e",
                    "#f59e0b",
                    "#a855f7"
                ],

                borderWidth: 2
            }
        ]
    };

    const categoryOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "bottom"
            },

            title: {
                display: true,
                text: "Inventory by Category",
                font: {
                    size: 16
                }
            }

        }

    };


    // -----------------------------
    // 2. STOCK LEVELS
    // -----------------------------

    const stockData = {

        labels: [
            "Antibiotics",
            "Pain Relief",
            "Diabetes",
            "Gastric",
            "Supplements"
        ],

        datasets: [

            {
                label: "Available Stock",

                data: [
                    80,
                    55,
                    40,
                    65,
                    50
                ],

                backgroundColor: "#0d6efd"
            },

            {
                label: "Low Stock",

                data: [
                    10,
                    8,
                    5,
                    7,
                    6
                ],

                backgroundColor: "#f59e0b"
            },

            {
                label: "Out of Stock",

                data: [
                    2,
                    3,
                    1,
                    2,
                    1
                ],

                backgroundColor: "#ef4444"
            }

        ]

    };

    const stockOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "bottom"
            },

            title: {
                display: true,
                text: "Stock Levels by Category",
                font: {
                    size: 16
                }
            }

        },

        scales: {

            y: {
                beginAtZero: true
            }

        }

    };


    // -----------------------------
    // 3. MONTHLY PURCHASE VALUES
    // -----------------------------

    const purchaseData = {

        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ],

        datasets: [

            {
                label: "Purchase Value",

                data: [
                    12000,
                    15000,
                    11000,
                    18000,
                    16000,
                    22000
                ],

                borderColor: "#0d6efd",

                backgroundColor: "rgba(13,110,253,0.15)",

                tension: 0.4,

                fill: true,

                pointRadius: 5

            }

        ]

    };

    const purchaseOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "bottom"
            },

            title: {
                display: true,
                text: "Monthly Purchase Values",
                font: {
                    size: 16
                }
            }

        },

        scales: {

            y: {
                beginAtZero: true,

                ticks: {

                    callback: function(value) {

                        return "₹" + value;

                    }

                }

            }

        }

    };


    return (

        <div className="row g-4">

            {/* CATEGORY DOUGHNUT */}

            <div className="col-lg-4">

                <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                        borderRadius: "15px"
                    }}
                >

                    <div
                        className="card-body"
                        style={{ height: "380px" }}
                    >

                        <Doughnut
                            data={categoryData}
                            options={categoryOptions}
                        />

                    </div>

                </div>

            </div>


            {/* STOCK BAR CHART */}

            <div className="col-lg-4">

                <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                        borderRadius: "15px"
                    }}
                >

                    <div
                        className="card-body"
                        style={{ height: "380px" }}
                    >

                        <Bar
                            data={stockData}
                            options={stockOptions}
                        />

                    </div>

                </div>

            </div>


            {/* PURCHASE LINE CHART */}

            <div className="col-lg-4">

                <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                        borderRadius: "15px"
                    }}
                >

                    <div
                        className="card-body"
                        style={{ height: "380px" }}
                    >

                        <Line
                            data={purchaseData}
                            options={purchaseOptions}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default InventoryChart;