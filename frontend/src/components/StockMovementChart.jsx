import { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

function StockMovementChart() {
    const [stockData, setStockData] = useState([]);

    useEffect(() => {
        fetchStockMovement();
    }, []);

    const fetchStockMovement = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/stock-logs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const logs = response.data;

            const groupedData = {};

            logs.forEach((log) => {
                if (!log.actionDate) return;

                const date = log.actionDate.split("T")[0];

                if (!groupedData[date]) {
                    groupedData[date] = {
                        date: date,
                        added: 0,
                        removed: 0,
                    };
                }

                if (log.action === "STOCK_IN") {
                    groupedData[date].added += log.quantity || 0;
                }

                if (log.action === "STOCK_OUT") {
                    groupedData[date].removed += log.quantity || 0;
                }
            });

            const chartData = Object.values(groupedData).sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );

            setStockData(chartData);

        } catch (error) {
            console.error("Error fetching stock movement:", error);
        }
    };

    return (
        <div className="stock-movement-chart">

            <div className="chart-header">
                <h2>Stock Movement</h2>
                <p>Stock added and removed over time</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={stockData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                    }}
                >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="added"
                        name="Stock Added"
                        stroke="#2196F3"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />

                    <Line
                        type="monotone"
                        dataKey="removed"
                        name="Stock Removed"
                        stroke="#F44336"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />

                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}

export default StockMovementChart;