import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MedicineList.css";

function MedicineList() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchMedicines = () => {
    fetch("http://localhost:8080/medicines", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMedicines(data);
      })
      .catch((error) => {
        console.error("Error fetching medicines:", error);
      });
  };

  useEffect(() => {
    fetchMedicines();
  }, []);
  const categories = [
    ...new Set(
      medicines
        .map((medicine) => medicine.category?.trim())
        .filter(Boolean)
    ),
  ].sort();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/medicines/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Medicine deleted successfully!");

        setMedicines((prev) =>
          prev.filter((medicine) => medicine.medicineId !== id)
        );
      } else {
        // Read error message sent by backend
        const errorMessage = await response.text();

        alert(errorMessage || "Failed to delete medicine.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting medicine.");
    }
  };
  const handleEdit = (medicine) => {
    navigate(`/edit-medicine/${medicine.medicineId}`);
  };

  return (
    <div className="medicine-container">
      <h1 className="title">Medicine Inventory</h1>

      <div className="medicine-filters">
        <input
          type="text"
          className="search-box"
          placeholder="Search Medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />




        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>


      <table className="medicine-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Medicine Name</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>Batch No</th>
            <th>Expiry Date</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Supplier</th>
            {role === "Admin" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {medicines
            .filter((medicine) =>
              medicine.medicineName
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .filter((medicine) =>
              categoryFilter === "All" ||
              medicine.category?.trim().toLowerCase() === categoryFilter.toLowerCase()
            )

            .map((medicine) => (
              <tr key={medicine.medicineId}>
                <td>{medicine.medicineId}</td>
                <td>{medicine.medicineName}</td>
                <td>{medicine.category}</td>
                <td>{medicine.manufacturer}</td>
                <td>{medicine.batchNo}</td>
                <td>{medicine.expiryDate}</td>
                <td>₹{medicine.unitPrice}</td>
                <td>{medicine.quantity}</td>
                <td>{medicine.supplier?.supplierName}</td>
                {role === "Admin" && (
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(medicine)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(medicine.medicineId)}

                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicineList;