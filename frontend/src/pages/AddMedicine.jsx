import { useEffect, useState } from "react";

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
      quantity:
        Number(medicine.quantity),
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
    <div className="medicine-container">
      <h1>Add Medicine</h1>

      <form onSubmit={handleSubmit}>

        <label>Medicine Name</label><br />
        <input
          type="text"
          name="medicineName"
          value={medicine.medicineName}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Category</label><br />
        <input
          type="text"
          name="category"
          value={medicine.category}
          onChange={handleChange}
        />
        <br /><br />

        <label>Manufacturer</label><br />
        <input
          type="text"
          name="manufacturer"
          value={medicine.manufacturer}
          onChange={handleChange}
        />
        <br /><br />

        <label>Batch No</label><br />
        <input
          type="text"
          name="batchNo"
          value={medicine.batchNo}
          onChange={handleChange}
        />
        <br /><br />

        <label>Expiry Date</label><br />
        <input
          type="date"
          name="expiryDate"
          value={medicine.expiryDate}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Unit Price</label><br />
        <input
          type="number"
          name="unitPrice"
          value={medicine.unitPrice}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Quantity</label><br />
        <input
          type="number"
          name="quantity"
          value={medicine.quantity}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Supplier</label><br />
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

        <br /><br />

        <button type="submit">
          Add Medicine
        </button>

      </form>
    </div>
  );
}

export default AddMedicine;