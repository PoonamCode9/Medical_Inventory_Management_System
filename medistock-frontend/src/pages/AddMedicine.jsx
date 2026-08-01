import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMedicine } from "../services/medicineService";
import Navbar from "../components/Navbar";

function AddMedicine() {

    const navigate = useNavigate();

    const [medicine, setMedicine] = useState({
        medicineName: "",
        category: "",
        batchNumber: "",
        quantity: "",
        price: "",
        manufacturingDate: "",
        expiryDate: ""
    });

    const handleChange = (e) => {
        setMedicine({
            ...medicine,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!medicine.medicineName.trim()) {
            alert("Medicine Name is required");
            return;
        }

        if (!medicine.category.trim()) {
            alert("Category is required");
            return;
        }

        if (!medicine.batchNumber.trim()) {
            alert("Batch Number is required");
            return;
        }

        if (medicine.quantity === "" || Number(medicine.quantity) <= 0) {
            alert("Quantity must be greater than 0");
            return;
        }

        if (medicine.price === "" || Number(medicine.price) <= 0) {
            alert("Price must be greater than 0");
            return;
        }

        if (!medicine.manufacturingDate) {
            alert("Manufacturing Date is required");
            return;
        }

        if (!medicine.expiryDate) {
            alert("Expiry Date is required");
            return;
        }

        if (
            new Date(medicine.expiryDate) <=
            new Date(medicine.manufacturingDate)
        ) {
            alert("Expiry Date must be after Manufacturing Date");
            return;
        }

        await addMedicine(medicine);

        alert("Medicine Added Successfully");

        navigate("/medicines");
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Add Medicine</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        className="form-control mb-2"
                        placeholder="Medicine Name"
                        name="medicineName"
                        value={medicine.medicineName}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        placeholder="Category"
                        name="category"
                        value={medicine.category}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        placeholder="Batch Number"
                        name="batchNumber"
                        value={medicine.batchNumber}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Quantity"
                        name="quantity"
                        value={medicine.quantity}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Price"
                        name="price"
                        value={medicine.price}
                        onChange={handleChange}
                    />

                    <label>Manufacturing Date</label>

                    <input
                        type="date"
                        className="form-control mb-2"
                        name="manufacturingDate"
                        value={medicine.manufacturingDate}
                        onChange={handleChange}
                    />

                    <label>Expiry Date</label>

                    <input
                        type="date"
                        className="form-control mb-3"
                        name="expiryDate"
                        value={medicine.expiryDate}
                        onChange={handleChange}
                    />

                    <button className="btn btn-success">
                        Save Medicine
                    </button>

                </form>

            </div>
        </>
    );
}

export default AddMedicine;