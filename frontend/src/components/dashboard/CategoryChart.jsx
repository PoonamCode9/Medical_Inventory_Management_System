import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <ChartPie size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Category Distribution
            </h2>
            <p className="text-[11px] text-slate-400">
              Stock breakdown by medicine category
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
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
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#a5b4fc" }}
              />

              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: "11px",
                  paddingTop: "8px",
                  fontWeight: 500,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No category distribution data available.
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryChart;
