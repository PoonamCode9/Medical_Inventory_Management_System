import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewPurchaseOrder.css";

function ViewPurchaseOrder() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);



    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");


    useEffect(() => {
        fetchOrders();
    }, []);


    const fetchOrders = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/purchase-orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data);

        } catch (error) {

            console.log(error);
            alert("Failed to fetch purchase orders");

        }

    };


    const deleteOrder = async (id) => {

        if (window.confirm("Are you sure you want to delete this order?")) {

            try {

                await axios.delete(
                    `http://localhost:8080/purchase-orders/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Purchase Order Deleted");

                fetchOrders();

            } catch (error) {

                console.log(error);

            }

        }

    };


    return (

        <div className="purchase-view-container">

            <div className="purchase-view-card">

                <h2>Purchase Orders</h2>

                <p>
                    Manage supplier orders and track delivery status
                </p>
                <div className="purchase-filters">

                    <input
                        type="text"
                        placeholder="Search Supplier..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>

                        {[...new Set(
                            orders
                                .map((order) => order.status)
                                .filter((status) => status)
                        )].map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>Order ID</th>
                            <th>Supplier</th>
                            <th>Order Date</th>
                            <th>Delivery Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>{role === "Admin" ? "Action" : "View"}</th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            orders
                                .filter((order) => {
                                    const supplierName =
                                        order.supplier?.supplierName?.toLowerCase() || "";

                                    const searchText = search.toLowerCase();

                                    const matchesSearch =
                                        supplierName.includes(searchText);

                                    const matchesStatus =
                                        statusFilter === "All" ||
                                        order.status === statusFilter;

                                    return matchesSearch && matchesStatus;
                                })
                                .map(order => (

                                    <tr key={order.orderId}>

                                        <td>
                                            {order.orderId}
                                        </td>


                                        <td>
                                            {order.supplier.supplierName}
                                        </td>


                                        <td>
                                            {order.orderDate}
                                        </td>


                                        <td>
                                            {order.expectedDelivery}
                                        </td>


                                        <td>
                                            ₹ {order.totalAmount}
                                        </td>


                                        <td>

                                            <span className="status">

                                                {order.status}

                                            </span>

                                        </td>


                                        <td>

                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                            >
                                                View
                                            </button>

                                            {role === "Admin" && (
                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteOrder(order.orderId)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}


                                        </td>


                                    </tr>

                                ))
                        }

                    </tbody>

                </table>



                {
                    selectedOrder && (

                        <div className="order-details">

                            <h3>
                                Purchase Order #{selectedOrder.orderId}
                            </h3>


                            <p>
                                Supplier:
                                <b>
                                    {" "}{selectedOrder.supplier.supplierName}
                                </b>
                            </p>


                            <h4>
                                Medicines
                            </h4>


                            <table>

                                <thead>
                                    <tr>
                                        <th>Medicine</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>


                                <tbody>

                                    {
                                        selectedOrder.items.map(item => (

                                            <tr key={item.itemId}>

                                                <td>
                                                    {item.medicine.medicineName}
                                                </td>

                                                <td>
                                                    {item.quantity}
                                                </td>

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>


                            <button
                                className="close-btn"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>


                        </div>

                    )
                }


            </div>

        </div>

    );

}

export default ViewPurchaseOrder;