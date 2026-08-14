import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

function MedicineStatusChart() {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchMedicineStatus();
    }, []);

    const fetchMedicineStatus = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/medicines/status-count",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setData([
                {
                    status: "Low Stock",
                    count: response.data.lowStock,
                    color: "#f59e0b"
                },
                {
                    status: "Expired",
                    count: response.data.expired,
                    color: "#ef4444"
                },
                {
                    status: "Expiring Soon",
                    count: response.data.expiringSoon,
                    color: "#f97316"
                },
                {
                    status: "Valid",
                    count: response.data.valid,
                    color: "#22c55e"
                }
            ]);

        } catch (error) {

            console.error("Error fetching medicine status:", error);

        }
    };

    return (
        <div className="medicine-status-chart">

            <div className="chart-header">
                <h2>Medicine Status Overview</h2>
                <p>Current inventory status</p>
            </div>

            <ResponsiveContainer width="100%" height={230}>

                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="status"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                    />

                    <Tooltip
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        formatter={(value) => [`${value}`, "Medicines"]}
                    />

                    <Bar
                        dataKey="count"
                        barSize={45}
                        radius={[5, 5, 0, 0]}
                    >

                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}

export default MedicineStatusChart;