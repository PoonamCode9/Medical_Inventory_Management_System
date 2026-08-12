import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import API from "../../api/Api";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

function InventoryChart() {
  const [data, setData] = useState([]);

  const fetchTopMedicines = async () => {
    try {
      const res = await API.get("/inventory/top-medicines-stock");
      setData(res.data);
    } catch (error) {
      console.error("Error loading inventory chart:", error);
    }
  };

  useEffect(() => {
    fetchTopMedicines();
  }, []);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Inventory Analytics
            </h2>
            <p className="text-[11px] text-slate-400">
              Top medicine stock levels across inventory
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="medicineName"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                tickFormatter={(name) =>
                  name.length > 9 ? name.substring(0, 9) + ".." : name
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#38bdf8", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="stock"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorStock)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No stock analytics data available.
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryChart;
