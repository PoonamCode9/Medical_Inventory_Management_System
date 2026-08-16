import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SupplierCards from "./SupplierCards";
import SupplierSearch from "./SupplierSearch";
import "../Medicines/Medicines.css";
import "../Medicines/MedicineFormModal.css";
import "./SuppliersTable.css";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaTruck
} from "react-icons/fa";

const Suppliers = () => {

    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [viewSupplier, setViewSupplier] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const suppliersPerPage = 6;

    const [formData, setFormData] = useState({
        supplierName: "",
        contactNumber: "",
        email: "",
        address: ""
    });

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

            Swal.fire({
                icon: "error",
                title: "Failed to load suppliers"
            });
        }
    };

    useEffect(() => {

        const loadInitialData = async () => {

            setLoading(true);

            await fetchSuppliers();

            setLoading(false);

        };

        loadInitialData();

    }, []);

    // Search Supplier
    const searchSupplier = async (keyword) => {

        setSearch(keyword);
        setCurrentPage(1);

        try {

            const token = localStorage.getItem("token");

            const url =
                keyword.trim() === ""
                    ? "http://localhost:8080/api/suppliers"
                    : `http://localhost:8080/api/suppliers/search?keyword=${keyword}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSuppliers(response.data);

        } catch (err) {

            console.log(err);

        }

    };

    // Add / Update Supplier
    const handleSave = async () => {

        try {

            const token = localStorage.getItem("token");

            if (selectedSupplier) {

                await axios.put(
                    `http://localhost:8080/api/suppliers/${selectedSupplier.supplierId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                Swal.fire({
                    icon: "success",
                    title: "Supplier Updated",
                    confirmButtonColor: "#14968d"
                });

            } else {

                await axios.post(
                    "http://localhost:8080/api/suppliers",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                Swal.fire({
                    icon: "success",
                    title: "Supplier Added",
                    confirmButtonColor: "#14968d"
                });

            }

            fetchSuppliers();

            setShowModal(false);

            setSelectedSupplier(null);

            setFormData({
                supplierName: "",
                contactNumber: "",
                email: "",
                address: ""
            });

        } catch (err) {

            console.log(err);

            Swal.fire({
                icon: "error",
                title: "Operation Failed",
                text: err.response?.data?.message || "Something went wrong"
            });

        }

    };

    // Delete Supplier
    const deleteSupplier = async (id) => {

        const result = await Swal.fire({

            title: "Delete Supplier?",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#d33",

            cancelButtonColor: "#14968d",

            confirmButtonText: "Delete"

        });

        if (!result.isConfirmed) return;

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/api/suppliers/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Supplier Deleted",
                confirmButtonColor: "#14968d"
            });

            fetchSuppliers();

        } catch {

            Swal.fire({
                icon: "error",
                title: "Delete Failed"
            });

        }

    };

    // Edit Supplier
    const editSupplier = (supplier) => {

        setSelectedSupplier(supplier);

        setFormData({

            supplierName: supplier.supplierName,

            contactNumber: supplier.contactNumber,

            email: supplier.email,

            address: supplier.address

        });

        setShowModal(true);

    };

    // Filter Suppliers
    const filteredSuppliers = suppliers.filter((supplier) =>

        supplier.supplierName.toLowerCase().includes(search.toLowerCase()) ||

        supplier.email.toLowerCase().includes(search.toLowerCase()) ||

        supplier.contactNumber.includes(search)

    );

    // Pagination
    const indexOfLastSupplier = currentPage * suppliersPerPage;

    const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;

    const currentSuppliers = filteredSuppliers.slice(

        indexOfFirstSupplier,

        indexOfLastSupplier

    );

    const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-success"></div>
                <h4>Loading Suppliers...</h4>
            </div>
        );
    }

    return (
        <div className="medicine-page">
            {/* Header */}
            <div className="medicine-header">
                <div>
                    <h1>🚚 Suppliers Dashboard</h1>
                    <p>Manage all suppliers efficiently</p>
                </div>

                <button
                    className="add-btn"
                    onClick={() => {
                        setSelectedSupplier(null);
                        setFormData({
                            supplierName: "",
                            contactNumber: "",
                            email: "",
                            address: ""
                        });
                        setShowModal(true);
                    }}
                >
                    <FaPlus /> Add Supplier
                </button>
            </div>

            <SupplierCards suppliers={suppliers} />
            <SupplierSearch
                search={search}
                searchSupplier={searchSupplier}
            />
            {/* Table */}
            <div className="card shadow border-0 rounded-4 suppliers-table-wrapper">
                <div className="card-body p-0">

                    <table className="table table-hover align-middle mb-0">

                        <thead style={{ background: "#14968d", color: "white" }}>
                            <tr>
                                <th>ID</th>
                                <th>Supplier</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {currentSuppliers.length > 0 ? (

                                currentSuppliers.map((supplier) => (

                                    <tr key={supplier.supplierId}>

                                        <td>{supplier.supplierId}</td>

                                        <td>
                                            <div className="supplier-cell">
                                                <div className="supplier-avatar">
                                                    <FaTruck />
                                                </div>
                                                <h6>{supplier.supplierName}</h6>
                                            </div>
                                        </td>

                                        <td>{supplier.contactNumber}</td>

                                        <td title={supplier.email}>{supplier.email}</td>

                                        <td title={supplier.address}>{supplier.address}</td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={() => setViewSupplier(supplier)}
                                                >
                                                    <FaEye />
                                                </button>

                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => editSupplier(supplier)}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        deleteSupplier(supplier.supplierId)
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
                                    <td colSpan="6" className="text-center p-5">
                                        No Suppliers Found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                    {/* Pagination */}
                    <div className="pagination-container">

                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={currentPage === index + 1 ? "active-page" : ""}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>

                    </div>

                </div>
            </div>

            {/* Modal for Add / Edit */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="medicine-modal wide">

                        <h3>
                            {selectedSupplier ? "Edit Supplier" : "Add Supplier"}
                        </h3>

                        <div className="form-grid">

                            <div className="form-field full-width">
                                <label>Supplier Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. MedSupply Co."
                                    value={formData.supplierName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            supplierName: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label>Contact Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 9876543210"
                                    value={formData.contactNumber}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            contactNumber: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="e.g. contact@supplier.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-field full-width">
                                <label>Address</label>
                                <textarea
                                    placeholder="Street, city, state, ZIP"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value
                                        })
                                    }
                                />
                            </div>

                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">

                            <button
                                className="modal-cancel-btn"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedSupplier(null);
                                }}
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
            {viewSupplier && (
                <div className="drawer-overlay">

                    <div className="drawer">

                        <div className="drawer-header">

                            <h2>🚚 {viewSupplier.supplierName}</h2>

                            <button
                                className="close-btn"
                                onClick={() => setViewSupplier(null)}
                            >
                                ✖
                            </button>

                        </div>

                        <div className="drawer-content">

                            <div className="drawer-card">

                                <h5>Supplier Details</h5>

                                <p>
                                    <strong>ID :</strong> {viewSupplier.supplierId}
                                </p>

                                <p>
                                    <strong>Supplier :</strong> {viewSupplier.supplierName}
                                </p>

                                <p>
                                    <strong>Contact :</strong> {viewSupplier.contactNumber}
                                </p>

                                <p>
                                    <strong>Email :</strong> {viewSupplier.email}
                                </p>

                                <p>
                                    <strong>Address :</strong> {viewSupplier.address}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Suppliers;