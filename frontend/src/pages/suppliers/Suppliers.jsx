import React, { useEffect, useState } from "react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
} from "lucide-react";

// Unique supplier avatar/badge color generator based on supplier name
const getSupplierBadgeStyle = (name = "") => {
  const charCode = name.charCodeAt(0) || 0;
  const styles = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-teal-50 text-teal-700 border-teal-200",
    "bg-amber-50 text-amber-800 border-amber-200",
  ];
  return styles[charCode % styles.length];
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/suppliers");
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/suppliers/${id}`);
      alert("Supplier deleted successfully!");
      fetchSuppliers();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data || "Failed to delete supplier");
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.supplierName?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.phone?.includes(search)
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading suppliers...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Truck className="w-7 h-7 text-blue-600" />
            Suppliers
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage vendors, contact details, and supply sources
          </p>
        </div>

        {(role === "Admin" || role === "Pharmacist") && (
          <button
            onClick={() => navigate("/dashboard/suppliers/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Search by supplier name, contact person, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="p-4">Supplier Name</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Address</th>
                {(role === "Admin" || role === "Pharmacist") && (
                  <th className="p-4 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.supplierId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Supplier Name */}
                    <td className="p-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${getSupplierBadgeStyle(
                            supplier.supplierName || "S"
                          )}`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span>{supplier.supplierName || "N/A"}</span>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="p-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{supplier.contactPerson || "—"}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-slate-600 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{supplier.phone || "—"}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">
                          {supplier.email || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {supplier.address || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    {(role === "Admin" || role === "Pharmacist") && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/suppliers/edit/${supplier.supplierId}`
                              )
                            }
                            className="p-1.5 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Supplier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {role === "Admin" && (
                            <button
                              onClick={() => handleDelete(supplier.supplierId)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Supplier"
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
                    colSpan={role === "Admin" || role === "Pharmacist" ? "6" : "5"}
                    className="text-center py-10 text-slate-400"
                  >
                    No supplier records found.
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

export default Suppliers;