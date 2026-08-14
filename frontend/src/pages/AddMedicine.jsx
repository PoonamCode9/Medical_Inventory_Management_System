import { useEffect, useState } from "react";
import "../styles/AddMedicine.css";

function AddMedicine() {
  const [medicine, setMedicine] = useState({
    medicineName: "",
    category: "",
    manufacturer: "",
    batchNo: "",
    expiryDate: "",
    unitPrice: "",
    quantity: "",
    supplierId: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/suppliers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }
        return response.json();
      })
      .then((data) => {
        setSuppliers(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    setMedicine({
      ...medicine,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const medicineData = {
      medicineName: medicine.medicineName,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      batchNo: medicine.batchNo,
      expiryDate: medicine.expiryDate,
      unitPrice: medicine.unitPrice,
      quantity: Number(medicine.quantity),
      supplier: {
        supplierId: Number(medicine.supplierId),
      },
    };

    try {
      const response = await fetch("http://localhost:8080/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(medicineData),
      });

      if (!response.ok) {
        throw new Error("Failed to add medicine");
      }

      const data = await response.json();

      alert("Medicine added successfully!");

      console.log(data);

      setMedicine({
        medicineName: "",
        category: "",
        manufacturer: "",
        batchNo: "",
        expiryDate: "",
        unitPrice: "",
        quantity: "",
        supplierId: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error adding medicine.");
    }
  };

  return (
    <div className="medicine-page">

      <div className="medicine-card">

        {/* Page Heading */}
        <div className="medicine-header">
          <h1>Add Medicine</h1>
          <p>Add a new medicine to your inventory</p>
        </div>

        {/* Medicine Details Section */}
        <div className="medicine-section">

          <h2>Medicine Details</h2>

          <form onSubmit={handleSubmit}>

            <div className="medicine-field">
              <label>Medicine Name</label>
              <input
                type="text"
                name="medicineName"
                value={medicine.medicineName}
                onChange={handleChange}
                placeholder="Enter medicine name"
                required
              />
            </div>

            <div className="medicine-field">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={medicine.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <div className="medicine-field">
              <label>Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={medicine.manufacturer}
                onChange={handleChange}
                placeholder="Enter manufacturer"
              />
            </div>

            <div className="medicine-field">
              <label>Batch No</label>
              <input
                type="text"
                name="batchNo"
                value={medicine.batchNo}
                onChange={handleChange}
                placeholder="Enter batch number"
              />
            </div>

            <div className="medicine-field">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={medicine.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="medicine-field">
              <label>Unit Price</label>
              <input
                type="number"
                name="unitPrice"
                value={medicine.unitPrice}
                onChange={handleChange}
                placeholder="Enter unit price"
                required
              />
            </div>

            <div className="medicine-field">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={medicine.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="medicine-field">
              <label>Supplier</label>
              <select
                name="supplierId"
                value={medicine.supplierId}
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

            <button type="submit" className="add-medicine-btn">
              Add Medicine
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddMedicine;