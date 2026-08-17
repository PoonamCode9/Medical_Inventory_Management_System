import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


function InventoryPieChart({
    normalStock = 0,
    lowStock = 0,
    outOfStock = 0
}) {

    /*
     * If there is no inventory data yet,
     * show sample values so the dashboard
     * does not appear blank.
     */

    const hasData =
        normalStock > 0 ||
        lowStock > 0 ||
        outOfStock > 0;


    const normal = hasData ? normalStock : 14;
    const low = hasData ? lowStock : 4;
    const out = hasData ? outOfStock : 2;


    const data = {

        labels: [
            "Normal Stock",
            "Low Stock",
            "Out Of Stock"
        ],

        datasets: [
            {
                data: [
                    normal,
                    low,
                    out
                ],

                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#dc3545"
                ],

                borderColor: [
                    "#ffffff",
                    "#ffffff",
                    "#ffffff"
                ],

                borderWidth: 3,

                hoverOffset: 8
            }
        ]

    };


    const options = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: "60%",

        plugins: {

            legend: {
                position: "top",

                labels: {
                    padding: 18,
                    boxWidth: 35,
                    font: {
                        size: 14
                    }
                }
            },

            tooltip: {

                callbacks: {

                    label: function (context) {

                        const value =
                            context.raw;

                        return ` ${context.label}: ${value}`;

                    }

                }

            }

        }

    };


    return (

        <div>

            <div
                className="text-center mb-3"
            >

                <h4 className="fw-bold">
                    Stock Distribution
                </h4>

                <p className="text-muted mb-0">
                    Current stock health of your inventory
                </p>

            </div>


            <div
                style={{
                    height: "360px",
                    position: "relative"
                }}
            >

                <Doughnut
                    data={data}
                    options={options}
                />

            </div>


            {!hasData && (

                <div
                    className="alert alert-info text-center mt-3"
                >

                    <small>
                        Sample data displayed.
                        Add medicines to view your
                        actual inventory distribution.
                    </small>

                </div>

            )}

        </div>

    );

}


export default InventoryPieChart;