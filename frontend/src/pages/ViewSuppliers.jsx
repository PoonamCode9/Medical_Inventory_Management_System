import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewSuppliers.css";

function ViewSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [search, setSearch] = useState("");
  const [addressFilter, setAddressFilter] = useState("All");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/suppliers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8080/suppliers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Supplier deleted successfully!");
      fetchSuppliers();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete supplier.");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/suppliers/${editingSupplier.supplierId}`,
        editingSupplier,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Supplier updated successfully!");

      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update supplier.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>View Suppliers</h2>
      <div className="supplier-filters">

        <input
          type="text"
          placeholder="Search Supplier or Contact Person..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={addressFilter}
          onChange={(e) => setAddressFilter(e.target.value)}
        >
          <option value="All">All Locations</option>

          {[...new Set(
            suppliers
              .map((supplier) => supplier.address)
              .filter((address) => address)
          )].map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </select>

      </div>

      {editingSupplier && (
        <div className="modal-overlay">
          <div className="modal-content">

            <span
              className="close-btn"
              onClick={() => setEditingSupplier(null)}
            >
              &times;
            </span>

            <h3>
              Update Supplier -
              <span className="supplier-name">
                {" "}
                {editingSupplier.supplierName}
              </span>
            </h3>

            <label>Supplier Name</label>
            <input
              type="text"
              value={editingSupplier.supplierName}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  supplierName: e.target.value,
                })
              }
            />

            <label>Contact Person</label>
            <input
              type="text"
              value={editingSupplier.contactPerson}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  contactPerson: e.target.value,
                })
              }
            />

            <label>Phone Number</label>
            <input
              type="text"
              value={editingSupplier.phone}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  phone: e.target.value,
                })
              }
            />

            <label>Email</label>
            <input
              type="email"
              value={editingSupplier.email}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  email: e.target.value,
                })
              }
            />

            <label>Address</label>
            <input
              type="text"
              value={editingSupplier.address}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  address: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button className="update-btn" onClick={handleUpdate}>
                Update Supplier
              </button>

              <button
                className="cancel-btn"
                onClick={() => setEditingSupplier(null)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            {role === "Admin" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {suppliers.length > 0 ? (
            suppliers
              .filter((supplier) => {
                const searchText = search.toLowerCase();

                const matchesSearch =
                  supplier.supplierName?.toLowerCase().includes(searchText) ||
                  supplier.contactPerson?.toLowerCase().includes(searchText);

                const matchesAddress =
                  addressFilter === "All" ||
                  supplier.address === addressFilter;

                return matchesSearch && matchesAddress;
              })
              .map((supplier) => (
                <tr key={supplier.supplierId}>
                  <td>{supplier.supplierId}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.address}</td>
                  {role === "Admin" && (
                    <td>
                      <div
                        className="action-buttons">
                        <button className="edit-btn"
                          onClick={() =>
                            setEditingSupplier({ ...supplier })
                          }
                        >
                          Edit
                        </button>

                        <button className="delete-btn"
                          onClick={() =>
                            handleDelete(supplier.supplierId)
                          }

                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={role === "Admin" ? 7 : 6}>No suppliers found</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default ViewSuppliers;