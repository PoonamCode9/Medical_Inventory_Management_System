import { useEffect, useState } from "react";
import "../styles/Stock.css";

function Stock() {
    const [medicines, setMedicines] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8080/medicines", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch medicines");
                }
                return response.json();
            })
            .then((data) => {
                data.sort((a, b) => a.medicineId - b.medicineId);
                setMedicines(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    const stockIn = (medicineId) => {
        const count = prompt("Enter quantity to add:");

        if (!count) return;

        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/medicines/${medicineId}/stock-in/${count}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Stock In failed");
                }
                return response.text();
            })
            .then(() => {
                alert("Stock added successfully");
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
                alert("Stock In failed");
            });
    };


    const stockOut = (medicineId) => {
        const count = prompt("Enter quantity to remove:");

        if (!count) return;

        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/medicines/${medicineId}/stock-out/${count}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Stock Out failed");
                }
                return response.text();
            })
            .then(() => {
                alert("Stock removed successfully");
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
                alert("Stock Out failed");
            });
    };

    return (
        <div className="medicine-container">
            <h1>Stock Management</h1>
            <div className="stock-filters">

                <input
                    type="text"
                    placeholder="Search Medicine..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>

                    {[...new Map(
                        medicines
                            .filter((medicine) => medicine.category)
                            .map((medicine) => [
                                medicine.category.trim().toLowerCase(),
                                medicine.category.trim()
                            ])
                    ).values()]
                        .sort()
                        .map((category) => (
                            <option key={category.toLowerCase()} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                            </option>
                        ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Stock Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

            </div>

            <table className="medicine-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Medicine Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Expiry Date</th>
                        <th>Supplier</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {medicines
                        .filter((medicine) =>
                            medicine.medicineName
                                ?.toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .filter((medicine) =>
                            categoryFilter === "All" ||
                            medicine.category?.trim().toLowerCase() ===
                            categoryFilter.toLowerCase()
                        )
                        .filter((medicine) => {
                            if (statusFilter === "All") return true;

                            if (statusFilter === "Out of Stock") {
                                return medicine.quantity === 0;
                            }

                            if (statusFilter === "Low Stock") {
                                return medicine.quantity > 0 && medicine.quantity <= 50;
                            }

                            if (statusFilter === "In Stock") {
                                return medicine.quantity > 50;
                            }

                            return true;
                        })
                        .map((medicine) => (
                            <tr key={medicine.medicineId}>
                                <td>{medicine.medicineId}</td>
                                <td>{medicine.medicineName}</td>
                                <td>{medicine.category}</td>
                                <td>{medicine.quantity}</td>

                                <td>
                                    {medicine.quantity === 0 ? (
                                        <span style={{ color: "red", fontWeight: "bold" }}>
                                            Out of Stock
                                        </span>
                                    ) : medicine.quantity <= 50 ? (
                                        <span style={{ color: "orange", fontWeight: "bold" }}>
                                            Low Stock
                                        </span>
                                    ) : (
                                        <span style={{ color: "green", fontWeight: "bold" }}>
                                            In Stock
                                        </span>
                                    )}
                                </td>

                                <td>{medicine.expiryDate}</td>
                                <td>{medicine.supplier?.supplierName}</td>

                                <td>
                                    <div
                                        className="action-buttons">
                                        <button
                                            className="stock-in-btn"
                                            onClick={() => stockIn(medicine.medicineId)}
                                        >
                                            ➕ Stock In
                                        </button>


                                        <button
                                            className="stock-out-btn"
                                            style={{ marginLeft: "10px" }}
                                            onClick={() => stockOut(medicine.medicineId)}
                                        >
                                            ➖ Stock Out
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default Stock;