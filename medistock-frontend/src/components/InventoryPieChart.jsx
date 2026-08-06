import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function InventoryPieChart({
  normalStock,
  lowStock,
  outOfStock
}) {

  const data = {

    labels: [
      "Normal Stock",
      "Low Stock",
      "Out Of Stock"
    ],

    datasets: [
      {
        data: [
          normalStock,
          lowStock,
          outOfStock
        ],

        backgroundColor: [
          "#198754",
          "#ffc107",
          "#dc3545"
        ],

        borderWidth: 1
      }
    ]

  };

  return (

    <Pie data={data}/>

  );

}

export default InventoryPieChart;