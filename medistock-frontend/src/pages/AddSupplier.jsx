import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSupplier } from "../services/supplierService";
import Navbar from "../components/Navbar";

function AddSupplier() {

    const navigate = useNavigate();

    const [supplier, setSupplier] = useState({
        supplierName: "",
        contactNumber: "",
        email: "",
        address: ""
    });

    const handleChange = (e) => {
        setSupplier({
            ...supplier,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!supplier.supplierName.trim()) {
            alert("Supplier Name is required");
            return;
        }

        if (!supplier.contactNumber.trim()) {
            alert("Contact Number is required");
            return;
        }

        if (!/^\d{10}$/.test(supplier.contactNumber)) {
            alert("Contact Number must be exactly 10 digits");
            return;
        }

        if (!supplier.email.trim()) {
            alert("Email is required");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(supplier.email)) {
            alert("Enter a valid Email Address");
            return;
        }

        if (!supplier.address.trim()) {
            alert("Address is required");
            return;
        }

        await addSupplier(supplier);

        alert("Supplier Added Successfully");

        navigate("/suppliers");
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Add Supplier</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        className="form-control mb-2"
                        placeholder="Supplier Name"
                        name="supplierName"
                        value={supplier.supplierName}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        placeholder="Contact Number"
                        name="contactNumber"
                        value={supplier.contactNumber}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        className="form-control mb-2"
                        placeholder="Email"
                        name="email"
                        value={supplier.email}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-3"
                        placeholder="Address"
                        name="address"
                        value={supplier.address}
                        onChange={handleChange}
                    />

                    <button className="btn btn-success">
                        Save Supplier
                    </button>

                </form>

            </div>

        </>
    );
}

export default AddSupplier;