import { useState } from "react";

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
    <div className="medicine-container">
      <h1>Add Supplier</h1>

      <form onSubmit={handleSubmit}>

        <label>Supplier Name</label><br />
        <input
          type="text"
          name="supplierName"
          value={supplier.supplierName}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Contact Person</label><br />
        <input
          type="text"
          name="contactPerson"
          value={supplier.contactPerson}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Phone</label><br />
        <input
          type="text"
          name="phone"
          value={supplier.phone}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Email</label><br />
        <input
          type="email"
          name="email"
          value={supplier.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Address</label><br />
        <textarea
          name="address"
          value={supplier.address}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">
          Add Supplier
        </button>

      </form>
    </div>
  );
}

export default AddSupplier;