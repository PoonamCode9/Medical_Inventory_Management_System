import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function InventoryChart({
  medicines,
  suppliers,
  purchases,
  lowStock,
  expired,
}) {

  const data = {
    labels: [
      "Medicines",
      "Suppliers",
      "Purchases",
      "Low Stock",
      "Expired",
    ],

    datasets: [
      {
        label: "Inventory Statistics",
        data: [
          medicines,
          suppliers,
          purchases,
          lowStock,
          expired,
        ],

        backgroundColor: [
          "#0d6efd", // Blue
          "#198754", // Green
          "#212529", // Black
          "#ffc107", // Yellow
          "#dc3545", // Red
        ],

        borderColor: [
          "#0a58ca",
          "#146c43",
          "#000000",
          "#ffca2c",
          "#bb2d3b",
        ],

        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: true,
        text: "Medicine Inventory Analytics",
        font: {
          size: 20,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default InventoryChart;