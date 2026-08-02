import {
  ResponsiveContainer,
  LineChart,
  Line,
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
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopMedicines();
  }, []);

  console.log(data);

  return (
    <div className="rounded-xl shadow-md p-5">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              Medicine Stock Overview
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Top stock levels across inventory
            </p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="medicineName"
            interval={0}
            angle={0}
            textAnchor="middle"
            height={40}
            tick={{ fontSize: 10, fill: "#4b5563" }}
            tickFormatter={(name) =>
              name.length > 8 ? name.substring(0, 8) + "..." : name
            }
          />
          <YAxis />
          <Tooltip contentStyle={{
                  backgroundColor: "#f8fcff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  border: "none",
                }}/>
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InventoryChart;
