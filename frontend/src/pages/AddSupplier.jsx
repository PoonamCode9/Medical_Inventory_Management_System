import { useState } from "react";
import "../styles/AddSuplier.css";

function AddSupplier() {

  const [supplier, setSupplier] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
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

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(supplier)
      });

      if (!response.ok) {
        throw new Error("Failed to add supplier");
      }

      await response.json();

      alert("Supplier added successfully!");

      setSupplier({
        supplierName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: ""
      });

    } catch (error) {
      console.error(error);
      alert("Error adding supplier.");
    }
  };

  return (
    <div className="supplier-page">

      <div className="supplier-card">

        {/* Page Heading */}
        <div className="supplier-header">
          <h1>Add Supplier</h1>
          <p>Add a new supplier to your inventory</p>
        </div>

        {/* Supplier Details */}
        <div className="supplier-section">

          <h2>Supplier Details</h2>

          <form onSubmit={handleSubmit}>

            <div className="supplier-field">
              <label>Supplier Name</label>
              <input
                type="text"
                name="supplierName"
                value={supplier.supplierName}
                onChange={handleChange}
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div className="supplier-field">
              <label>Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={supplier.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person"
                required
              />
            </div>

            <div className="supplier-field">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={supplier.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="supplier-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={supplier.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="supplier-field">
              <label>Address</label>
              <textarea
                name="address"
                value={supplier.address}
                onChange={handleChange}
                placeholder="Enter supplier address"
                required
              />
            </div>

            <button type="submit" className="add-supplier-btn">
              Add Supplier
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddSupplier;