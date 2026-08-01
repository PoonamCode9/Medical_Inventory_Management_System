import "../css/Inventory.css";

import { useEffect, useState } from "react";
import API from "../services/api";

function Inventory() {

    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {

        try {

            const response = await API.get("/inventory");

            setInventory(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="inventory-page">

            <>
<h2 className="page-title">
    📦 Inventory
</h2>

<p className="page-subtitle">
    Monitor medicine stock levels
</p>

<div className="row mb-4">

    <div className="col-md-4">

        <div className="stats-card bg-primary">

            <h5>Total Items</h5>

            <h2>{inventory.length}</h2>

        </div>

    </div>

    <div className="col-md-4">

        <div className="stats-card bg-success">

            <h5>Healthy Stock</h5>

            <h2>
                {
                    inventory.filter(
                        item=>item.availableStock>item.minimumStock
                    ).length
                }
            </h2>

        </div>

    </div>

    <div className="col-md-4">

        <div className="stats-card bg-danger">

            <h5>Low Stock</h5>

            <h2>
                {
                    inventory.filter(
                        item=>item.availableStock<=item.minimumStock
                    ).length
                }
            </h2>

        </div>

    </div>

</div>

{
    inventory.filter(item => item.availableStock <= item.minimumStock).length > 0 && (

        <div className="alert alert-danger mb-4">

            <h5>⚠ Low Stock Alerts</h5>

            {
                inventory
                    .filter(item => item.availableStock <= item.minimumStock)
                    .map(item => (

                        <div key={item.id}>

                            • <b>{item.medicine?.medicineName}</b> has only <b>{item.availableStock}</b> items remaining.

                        </div>

                    ))
            }

        </div>

    )
}

            <div className="table-card">

<table className="table table-hover align-middle">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Medicine Name</th>
                        <th>Available Stock</th>
<th>Minimum Stock</th>
<th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        inventory.map((item) => (

                            <tr key={item.id}>

                                <td>{item.id}</td>

                                <td>{item.medicine?.medicineName}</td>

                               <td>{item.availableStock}</td>

<td>{item.minimumStock}</td>

<td>

    {item.availableStock > item.minimumStock ? (

        <span className="badge bg-success">
            Healthy
        </span>

    ) : (

        <span className="badge bg-danger">
            Low Stock
        </span>

    )}

</td>

                                

                            </tr>

                        ))
                    }

                </tbody>

            </table>

            </div>

            </>

        </div>

    );

}

export default Inventory;