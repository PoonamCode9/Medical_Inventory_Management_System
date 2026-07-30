import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Medicines/Medicines.css";

import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

import PurchaseCards from "./PurchaseCards";
import PurchaseSearch from "./PurchaseSearch";

const PurchaseOrders = () => {

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewOrder, setViewOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    const [formData, setFormData] = useState({
        supplierId: "",
        medicineId: "",
        quantity: "",
        purchaseDate: "",
        status: "Pending"
    });

    // Fetch Purchase Orders
    const fetchPurchaseOrders = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/purchase-orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPurchaseOrders(response.data);

        } catch (err) {
            console.log(err);
        }

    };

    // Fetch Medicines
    const fetchMedicines = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/medicines",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMedicines(response.data);

        } catch (err) {
            console.log(err);
        }

    };

    // Fetch Suppliers
    const fetchSuppliers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/suppliers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuppliers(response.data);

        } catch (err) {
            console.log(err);
        }

    };

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchPurchaseOrders(),
                fetchMedicines(),
                fetchSuppliers()
            ]);

            setLoading(false);

        };

        loadData();

    }, []);

    const searchPurchase = async (keyword) => {

        setSearch(keyword);

        try {

            const token = localStorage.getItem("token");

            const url =
                keyword.trim() === ""
                    ? "http://localhost:8080/api/purchase-orders"
                    : `http://localhost:8080/api/purchase-orders/search?keyword=${keyword}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPurchaseOrders(response.data);

        } catch (err) {
            console.log(err);
        }

    };
    const handleSave = async () => {

    try {

        const token = localStorage.getItem("token");

        if (selectedOrder) {

            await axios.put(
                `http://localhost:8080/api/purchase-orders/${selectedOrder.purchaseId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            Swal.fire({
                icon: "success",
                title: "Purchase Order Updated",
                confirmButtonColor: "#14968d"
            });

        } else {

            await axios.post(
                "http://localhost:8080/api/purchase-orders",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            Swal.fire({
                icon: "success",
                title: "Purchase Order Added",
                confirmButtonColor: "#14968d"
            });

        }

        fetchPurchaseOrders();
        setShowModal(false);
        setSelectedOrder(null);

    } catch (err) {

        console.log(err);

    }

};
const deletePurchaseOrder = async (id) => {

    const result = await Swal.fire({

        title: "Delete Purchase Order?",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#d33",

        confirmButtonText: "Delete"

    });

    if (!result.isConfirmed) return;

    try {

        const token = localStorage.getItem("token");

        await axios.delete(
            `http://localhost:8080/api/purchase-orders/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        fetchPurchaseOrders();

    } catch (err) {

        console.log(err);

    }

};
const editPurchaseOrder = (order) => {

    setSelectedOrder(order);

    setFormData({

        supplierId: order.supplier?.supplierId,

        medicineId: order.medicine?.medicineId,

        quantity: order.quantity,

        purchaseDate: order.purchaseDate,

        status: order.status

    });

    setShowModal(true);

};
const filteredOrders = purchaseOrders.filter((order) => {

    const matchesSearch =

        order.medicine?.medicineName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||

        order.supplier?.supplierName
            ?.toLowerCase()
            .includes(search.toLowerCase());

    const matchesFilter =
        activeFilter === "ALL"
            ? true
            : order.status === activeFilter;

    return matchesSearch && matchesFilter;

});

const indexOfLastOrder = currentPage * ordersPerPage;

const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
);

const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
);
if (loading) {
    return (
        <div className="loading-container">
            <div className="spinner-border text-success" />
            <h4>Loading Purchase Orders...</h4>
        </div>
    );
}
return (
    <div className="medicine-page">

        {/* Header */}
        <div className="medicine-header">

            <div>
                <h1>📦 Purchase Orders</h1>
                <p>Manage medicine purchase orders</p>
            </div>

            <button
                className="add-btn"
                onClick={() => {

                    setSelectedOrder(null);

                    setFormData({
                        supplierId: "",
                        medicineId: "",
                        quantity: "",
                        purchaseDate: "",
                        status: "Pending"
                    });

                    setShowModal(true);

                }}
            >
                <FaPlus /> Add Order
            </button>

        </div>

        {/* Cards */}

        <PurchaseCards purchaseOrders={purchaseOrders} />

        {/* Search */}

        <PurchaseSearch
            search={search}
            searchPurchase={searchPurchase}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
        />

        {/* Table */}

        <div className="card shadow border-0 rounded-4">

            <div className="card-body p-0">

                <table className="table table-hover align-middle mb-0">

                    <thead
                        style={{
                            background: "#14968d",
                            color: "white"
                        }}
                    >

                        <tr>

                            <th>ID</th>

                            <th>Medicine</th>

                            <th>Supplier</th>

                            <th>Quantity</th>

                            <th>Purchase Date</th>

                            <th>Status</th>

                            <th className="text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredOrders.length > 0 ? (

                            currentOrders.map((order) => (

                                <tr key={order.purchaseId}>

                                    <td>{order.purchaseId}</td>

                                    <td>
                                        {order.medicine?.medicineName}
                                    </td>

                                    <td>
                                        {order.supplier?.supplierName}
                                    </td>

                                    <td>{order.quantity}</td>

                                    <td>{order.purchaseDate}</td>

                                    <td>

                                        <span
                                            className={`status-badge ${
                                                order.status === "Completed"
                                                    ? "instock"
                                                    : order.status === "Pending"
                                                    ? "low"
                                                    : "expired"
                                            }`}
                                        >

                                            {order.status}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() =>
                                                    setViewOrder(order)
                                                }
                                            >
                                                <FaEye />
                                            </button>

                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() =>
                                                    editPurchaseOrder(order)
                                                }
                                            >
                                                <FaEdit />
                                            </button>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() =>
                                                    deletePurchaseOrder(
                                                        order.purchaseId
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center p-5"
                                >
                                    No Purchase Orders Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

                {/* Pagination */}

                <div className="pagination-container">

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(currentPage - 1)
                        }
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (

                        <button
                            key={index}
                            className={
                                currentPage === index + 1
                                    ? "active-page"
                                    : ""
                            }
                            onClick={() =>
                                setCurrentPage(index + 1)
                            }
                        >
                            {index + 1}
                        </button>

                    ))}

                    <button
                        disabled={
                            currentPage === totalPages ||
                            totalPages === 0
                        }
                        onClick={() =>
                            setCurrentPage(currentPage + 1)
                        }
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
        {/* Modal */}
{showModal && (
    <div className="modal-overlay">
        <div className="medicine-modal">

            <h3>
                {selectedOrder
                    ? "Edit Purchase Order"
                    : "Add Purchase Order"}
            </h3>

            {/* Supplier */}

            <select
                className="supplier-select"
                value={formData.supplierId}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        supplierId: e.target.value
                    })
                }
            >

                <option value="">
                    Select Supplier
                </option>

                {suppliers.map((supplier) => (

                    <option
                        key={supplier.supplierId}
                        value={supplier.supplierId}
                    >
                        {supplier.supplierName}
                    </option>

                ))}

            </select>

            {/* Medicine */}

            <select
                className="supplier-select"
                value={formData.medicineId}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        medicineId: e.target.value
                    })
                }
            >

                <option value="">
                    Select Medicine
                </option>

                {medicines.map((medicine) => (

                    <option
                        key={medicine.medicineId}
                        value={medicine.medicineId}
                    >
                        {medicine.medicineName}
                    </option>

                ))}

            </select>

            <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        quantity: e.target.value
                    })
                }
            />

            <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        purchaseDate: e.target.value
                    })
                }
            />

            <select
                className="supplier-select"
                value={formData.status}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        status: e.target.value
                    })
                }
            >

                <option value="Pending">
                    Pending
                </option>

                <option value="Completed">
                    Completed
                </option>

                <option value="Cancelled">
                    Cancelled
                </option>

            </select>

            <div className="d-flex justify-content-end gap-2 mt-3">

                <button
                    className="modal-cancel-btn"
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </button>

                <button
                    className="modal-save-btn"
                    onClick={handleSave}
                >
                    Save
                </button>

            </div>

        </div>
    </div>
)}

{/* View Drawer */}

{viewOrder && (

    <div className="drawer-overlay">

        <div className="drawer">

            <div className="drawer-header">

                <h2>
                    📦 Purchase Order
                </h2>

                <button
                    className="close-btn"
                    onClick={() =>
                        setViewOrder(null)
                    }
                >
                    ✖
                </button>

            </div>

            <div className="drawer-content">

                <div className="drawer-card">

                    <h5>
                        Purchase Details
                    </h5>

                    <p>
                        <strong>ID :</strong>
                        {" "}
                        {viewOrder.purchaseId}
                    </p>

                    <p>
                        <strong>Medicine :</strong>
                        {" "}
                        {viewOrder.medicine?.medicineName}
                    </p>

                    <p>
                        <strong>Supplier :</strong>
                        {" "}
                        {viewOrder.supplier?.supplierName}
                    </p>

                    <p>
                        <strong>Quantity :</strong>
                        {" "}
                        {viewOrder.quantity}
                    </p>

                    <p>
                        <strong>Purchase Date :</strong>
                        {" "}
                        {viewOrder.purchaseDate}
                    </p>

                    <p>
                        <strong>Status :</strong>
                        {" "}
                        {viewOrder.status}
                    </p>

                </div>

            </div>

        </div>

    </div>

)}

</div>
);

};

export default PurchaseOrders;