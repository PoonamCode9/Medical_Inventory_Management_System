import React, { useEffect, useState } from "react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Pill,
  Calendar,
  Building2,
  Tag,
} from "lucide-react";

// Category ke basis par rich soft-colored badges define karne wala helper function
const getCategoryBadgeStyle = (categoryName = "") => {
  const cat = categoryName.toLowerCase().trim();

  if (cat.includes("antibiotic") || cat.includes("tablet")) {
    return "bg-blue-50 text-blue-700 border-blue-200/80";
  }
  if (cat.includes("vitamin") || cat.includes("supplement") || cat.includes("health")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  }
  if (cat.includes("pain") || cat.includes("analgesic") || cat.includes("fever")) {
    return "bg-amber-50 text-amber-800 border-amber-200/80";
  }
  if (cat.includes("syrup") || cat.includes("liquid") || cat.includes("tonic")) {
    return "bg-purple-50 text-purple-700 border-purple-200/80";
  }
  if (cat.includes("injection") || cat.includes("vaccine")) {
    return "bg-rose-50 text-rose-700 border-rose-200/80";
  }
  if (cat.includes("cream") || cat.includes("ointment") || cat.includes("gel")) {
    return "bg-teal-50 text-teal-700 border-teal-200/80";
  }

  // Fallback dynamic color assignment based on category name character hash
  const colorList = [
    "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    "bg-cyan-50 text-cyan-700 border-cyan-200/80",
    "bg-violet-50 text-violet-700 border-violet-200/80",
    "bg-sky-50 text-sky-700 border-sky-200/80",
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80",
  ];

  let hash = 0;
  for (let i = 0; i < cat.length; i++) {
    hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorList.length;
  return colorList[index];
};

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const fetchMedicines = async () => {
    try {
      const response = await API.get("/medicines");
      setMedicines(response.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/medicines/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/suppliers");
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/medicines/${id}`);
      alert("Medicine Deleted Successfully");
      fetchMedicines();
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("Something went wrong while deleting");
      }
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const query = search.toLowerCase();
    const matchesSearch =
      medicine.medicineName?.toLowerCase().includes(query) ||
      medicine.batchNo?.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "" || medicine.category === selectedCategory;

    const matchesSupplier =
      selectedSupplier === "" ||
      medicine.supplier?.supplierId === Number(selectedSupplier);

    return matchesSearch && matchesCategory && matchesSupplier;
  });

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading medicines...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex gap-3 items-center">
            <Pill className="w-6 h-6 text-emerald-600"/> Medicines</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage medicine catalogue, pricing, and suppliers
          </p>
        </div>

        {(role === "Admin" || role === "Pharmacist") && (
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow transition-colors cursor-pointer"
            onClick={() => navigate("/dashboard/medicines/add")}
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by medicine or batch..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          <option value="">All Suppliers</option>
          {suppliers.map((supplier) => (
            <option key={supplier.supplierId} value={supplier.supplierId}>
              {supplier.supplierName}
            </option>
          ))}
        </select>
      </div>

      {/* Medicines Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="p-4">Medicine</th>
                <th className="p-4">Category</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Batch Number</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Price</th>
                {(role === "Admin" || role === "Pharmacist") && (
                  <th className="p-4 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <tr
                    key={medicine.medicineId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-500" />
                        <span>{medicine.medicineName || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeStyle(
                          medicine.category
                        )}`}
                      >
                        <Tag className="w-3 h-3 opacity-70" />
                        {medicine.category || "General"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{medicine.supplier?.supplierName || "—"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {medicine.batchNo || "—"}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{medicine.expiryDate || "—"}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      ₹{Number(medicine.price || 0).toFixed(2)}
                    </td>

                    {(role === "Admin" || role === "Pharmacist") && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {(role === "Admin" || role === "Pharmacist") && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/medicines/edit/${medicine.medicineId}`
                                )
                              }
                              className="p-1.5 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Medicine"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {role === "Admin" && (
                            <button
                              onClick={() => handleDelete(medicine.medicineId)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Medicine"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={role === "Admin" || role === "Pharmacist" ? "7" : "6"}
                    className="text-center py-10 text-slate-400"
                  >
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Medicines;