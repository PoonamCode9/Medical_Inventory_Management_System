import { useEffect, useState } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function ExpiryStatusChart() {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchExpiryStatus();
    }, []);

    const fetchExpiryStatus = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/expiry-tracking/summary",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setData([
                {
                    name: "Expired",
                    value: response.data.expired,
                    color: "#ef4444"
                },
                {
                    name: "Expiring Soon",
                    value: response.data.expiringSoon,
                    color: "#f97316"
                },
                {
                    name: "Valid",
                    value: response.data.valid,
                    color: "#22c55e"
                }
            ]);

        } catch (error) {

            console.error("Error fetching expiry status:", error);

        }
    };

    return (
        <div className="expiry-status-chart">

            <div className="chart-header">
                <h2>Expiry Status</h2>
                <p>Distribution of medicine expiry status</p>
            </div>

            <ResponsiveContainer width="100%" height={250}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                    >

                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}

                    </Pie>

                    <Tooltip
                        formatter={(value) => [`${value}`, "Medicines"]}
                    />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>
    );
}

export default ExpiryStatusChart;