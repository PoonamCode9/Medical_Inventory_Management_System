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

function MedicineCategoryChart() {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchMedicineCategories();
    }, []);

    const fetchMedicineCategories = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/medicines/category-count",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const colors = [
                "#3b82f6",
                "#8b5cf6",
                "#06b6d4",
                "#ec4899",
                "#14b8a6"
            ];

            const categoryData = Object.entries(response.data).map(
                ([category, count], index) => ({
                    category,
                    count,
                    color: colors[index % colors.length]
                })
            );

            setData(categoryData);

        } catch (error) {

            console.error("Error fetching medicine categories:", error);

        }
    };

    return (
        <div className="medicine-category-chart">

            <div className="chart-header">
                <h2>Medicine Categories</h2>
                <p>Number of medicines in each category</p>
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
                        dataKey="category"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                    />

                    <Tooltip
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

export default MedicineCategoryChart;