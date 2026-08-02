import React, { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPie } from "lucide-react";
import API from "../../api/Api";

function CategoryChart() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/medicines/category-chart");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching category chart:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ChartPie size={18} />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              Medicine Categories
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Category-wise stock distribution
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={56}
                outerRadius={93}
                paddingAngle={4}
                cornerRadius={6}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8fcff",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  border: "none",
                }}
                itemStyle={{ color: "#259acc" }}
              />

              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No category data available.
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryChart;