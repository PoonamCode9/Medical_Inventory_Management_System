import { useState } from "react";
import { addSupplier } from "../services/supplierService";
import Navbar from "../components/Navbar";

function AddSupplier() {

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

    await addSupplier(supplier);

    alert("Supplier Added Successfully");

    setSupplier({
      supplierName: "",
      contactNumber: "",
      email: "",
      address: ""
    });
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
            className="form-control mb-2"
            placeholder="Email"
            name="email"
            value={supplier.email}
            onChange={handleChange}
          />

          <input
            className="form-control mb-2"
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