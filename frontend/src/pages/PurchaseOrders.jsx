import "../css/PurchaseOrders.css";
import { useEffect, useState } from "react";
import API from "../services/api";
function PurchaseOrders() {
    const [orders, setOrders] = useState([]);
    const [supplierId, setSupplierId] = useState("");
const [medicineId, setMedicineId] = useState("");
const [quantity, setQuantity] = useState("");
const [orderDate, setOrderDate] = useState("");
const [totalAmount, setTotalAmount] = useState("");
const [editingId, setEditingId] = useState(null);
    useEffect(() => {
        loadOrders();
    }, []);
    const loadOrders = async () => {
        try {
            const response = await API.get("/purchaseorders");
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const addPurchaseOrder = async () => {
    try {
        if (editingId === null) {
            await API.post("/purchaseorders", {
                supplier: {
                    id: supplierId
                },
                medicine: {
                    id: medicineId
                },
                quantity,
                totalAmount,
                orderDate
            });
            alert("Purchase Order Added Successfully");
        } else {
            await API.put(`/purchaseorders/${editingId}`, {
                supplier: {
                    id: supplierId
                },
                medicine: {
                    id: medicineId
                },
                quantity,
                totalAmount,
                orderDate
            });
            alert("Purchase Order Updated Successfully");
            setEditingId(null);
        }
        setSupplierId("");
        setMedicineId("");
        setQuantity("");
        setTotalAmount("");
        setOrderDate("");
        loadOrders();
    } catch (error) {
        console.log(error);
        alert("Operation Failed");
    }
};
const editOrder = (order) => {
    setEditingId(order.id);
    setSupplierId(order.supplier.id);
    setMedicineId(order.medicine.id);
    setQuantity(order.quantity);
    setTotalAmount(order.totalAmount);
    setOrderDate(order.orderDate);
};
const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this purchase order?"
    );
    if (!confirmDelete) {
        return;
    }
    try {
        await API.delete(`/purchaseorders/${id}`);
        alert("Purchase Order Deleted Successfully");
        loadOrders();
    } catch (error) {
        console.log(error);
        alert("Failed to Delete Purchase Order");
    }

};
    return (
        <div className="purchase-page">
<div className="container mt-4">
            <h2 className="page-title">
    📋 Purchase Orders
</h2>
<p className="page-subtitle">
    Manage medicine purchase orders
</p>
            <div className="card shadow border-0 rounded-4 p-4 mb-4">
    <h4 className="mb-4">
    {editingId === null
        ? "📋 Add Purchase Order"
        : "✏ Update Purchase Order"}
</h4>
    <div className="row mb-4">
    <div className="col-md-4">
        <div className="stats-card bg-primary">
            <h5>Total Orders</h5>
            <h2>{orders.length}</h2>
        </div>
    </div>
    <div className="col-md-4">
        <div className="stats-card bg-success">
            <h5>Total Quantity</h5>
            <h2>
                {
                    orders.reduce(
                        (sum,order)=>sum+order.quantity,
                        0
                    )
                }
            </h2>
        </div>
    </div>
    <div className="col-md-4">
        <div className="stats-card bg-warning">
            <h5>Total Amount</h5>
            <h2>
                ₹{
                    orders.reduce(
                        (sum,order)=>sum+order.totalAmount,
                        0
                    )
                }
            </h2>
        </div>
    </div>
</div>
    <input
        className="form-control mb-2"
        placeholder="Supplier ID"
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
    />
    <input
        className="form-control mb-2"
        placeholder="Medicine ID"
        value={medicineId}
        onChange={(e) => setMedicineId(e.target.value)}
    />
    <input
        className="form-control mb-2"
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
    />
    <input
        className="form-control mb-2"
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
    />
    <input
        className="form-control mb-3"
        type="date"
        value={orderDate}
        onChange={(e) => setOrderDate(e.target.value)}
    />
    <button
    className="btn btn-success w-100"
    onClick={addPurchaseOrder}
>
        {editingId === null ? "Add Purchase Order" : "Update Purchase Order"}
    </button>
</div>
            <div className="table-card">
<table className="table table-hover align-middle">
                <thead>
                   <tr>
    <th>ID</th>
    <th>Supplier</th>
    <th>Medicine</th>
    <th>Quantity</th>
    <th>Total Amount</th>
    <th>Order Date</th>
    <th>Actions</th>
</tr>
                </thead>
                <tbody>
                    {
                        orders.map((order) => (
                          <tr key={order.id}>
    <td>{order.id}</td>
    <td>{order.supplier?.supplierName}</td>
    <td>{order.medicine?.medicineName}</td>
    <td>{order.quantity}</td>
    <td>{order.totalAmount}</td>
    <td>{order.orderDate}</td>
    <td>
        <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => editOrder(order)}
        >
            Edit
        </button>
        <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteOrder(order.id)}
        >
            Delete
        </button>
    </td>
</tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}
export default PurchaseOrders;