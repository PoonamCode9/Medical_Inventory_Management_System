import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditMedicine.css";

function EditMedicine() {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [suppliers, setSuppliers] = useState([]);

    const [medicine, setMedicine] = useState({
        medicineName: "",
        category: "",
        manufacturer: "",
        batchNo: "",
        expiryDate: "",
        unitPrice: "",
        supplier: {
            supplierId: "",
        },
    });

    useEffect(() => {
        fetchMedicine();
        fetchSuppliers();
    }, []);

    const fetchMedicine = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/medicines/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setMedicine(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/suppliers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "supplierId") {
            setMedicine({
                ...medicine,
                supplier: {
                    supplierId: value,
                },
            });
        } else {
            setMedicine({
                ...medicine,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:8080/medicines/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(medicine),
                }
            );

            if (response.ok) {
                alert("Medicine Updated Successfully!");
                navigate("/medicines");
            } else {
                alert("Failed to update medicine.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="edit-container">
            <h1 className="edit-title"> Update Medicine</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Medicine Name</label>
                    <input
                        type="text"
                        name="medicineName"
                        placeholder="Medicine Name"
                        value={medicine.medicineName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={medicine.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Manufacturer</label>
                    <input
                        type="text"
                        name="manufacturer"
                        placeholder="Manufacturer"
                        value={medicine.manufacturer}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Batch Number</label>
                    <input
                        type="text"
                        name="batchNo"
                        placeholder="Batch Number"
                        value={medicine.batchNo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                        type="date"
                        name="expiryDate"
                        value={medicine.expiryDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Unit Price</label>
                    <input
                        type="number"
                        name="unitPrice"
                        placeholder="Unit Price"
                        value={medicine.unitPrice}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Supplier</label>
                    <select
                        name="supplierId"
                        value={medicine.supplier?.supplierId || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Supplier</option>

                        {suppliers.map((supplier) => (
                            <option
                                key={supplier.supplierId}
                                value={supplier.supplierId}
                            >
                                {supplier.supplierName}
                            </option>
                        ))}
                    </select>
                </div>

                <br />
                <br />

                <button type="submit"
                    className="update-btn">
                    Update Medicine
                </button>

            </form>
        </div>
    );
}

export default EditMedicine;