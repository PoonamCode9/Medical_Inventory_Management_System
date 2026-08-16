import React, { useEffect, useState } from "react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

const getSupplierBadgeStyle = (name = "") => {
  const charCode = name.charCodeAt(0) || 0;
  const styles = [
    "bg-blue-50 text-blue-700 border-blue-200/80",
    "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    "bg-purple-50 text-purple-700 border-purple-200/80",
    "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    "bg-teal-50 text-teal-700 border-teal-200/80",
    "bg-amber-50 text-amber-800 border-amber-200/80",
  ];
  return styles[charCode % styles.length];
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

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

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-800">
            Are you sure you want to delete this supplier?
          </p>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                confirmDelete(id);
              }}
              className="px-3 py-1 text-xs bg-rose-600 text-white rounded-md hover:bg-rose-700 font-medium transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  const confirmDelete = async (id) => {
    try {
      await API.delete(`/suppliers/${id}`);
      toast.success("Supplier deleted successfully");
      fetchSuppliers();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data || "Failed to delete supplier");
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
      <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading suppliers catalogue...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 min-h-screen bg-slate-50/60">
      <div className="mx-6 mt-6 mb-6 bg-gradient-to-r from-white via-white to-blue-50/40 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-500/20 ring-4 ring-blue-50">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Suppliers
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage vendors, contact details, and supply sources
              </p>
            </div>
          </div>
        </div>

        {(role === "Admin" || role === "Pharmacist") && (
          <button
            onClick={() => navigate("/dashboard/suppliers/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-blue-600/20 active:scale-98"
          >
            <Plus size={16} /> Add Supplier
          </button>
        )}
      </div>

      <div className="px-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by supplier, contact person, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Supplier Name</th>
                  <th className="py-3.5 px-5">Contact Person</th>
                  <th className="py-3.5 px-5">Phone</th>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5">Address</th>
                  {(role === "Admin" || role === "Pharmacist") && (
                    <th className="py-3.5 px-5 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier.supplierId}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      {/* Supplier Name */}
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${getSupplierBadgeStyle(
                              supplier.supplierName || "S"
                            )}`}
                          >
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <span>{supplier.supplierName || "N/A"}</span>
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="py-3.5 px-5 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{supplier.contactPerson || "—"}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-5 text-slate-600 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{supplier.phone || "—"}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[180px]">
                            {supplier.email || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-5 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {supplier.address || "—"}
                          </span>
                        </div>
                      </td>

                      {(role === "Admin" || role === "Pharmacist") && (
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/suppliers/edit/${supplier.supplierId}`
                                )
                              }
                              className="p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/70 rounded-lg transition-colors cursor-pointer"
                              title="Edit Supplier"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {role === "Admin" && (
                              <button
                                onClick={() => handleDelete(supplier.supplierId)}
                                className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/70 rounded-lg transition-colors cursor-pointer"
                                title="Delete Supplier"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
                      colSpan={
                        role === "Admin" || role === "Pharmacist" ? "6" : "5"
                      }
                      className="text-center py-12 text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-full">
                          <Truck className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          No supplier records found. Try adjusting your search query.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;