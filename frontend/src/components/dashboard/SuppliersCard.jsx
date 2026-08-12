import React, { useEffect, useState } from "react";
import { Building2, ArrowRight, Phone, Mail } from "lucide-react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";

function SuppliersCard() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await API.get("/suppliers");
        if (res.data && Array.isArray(res.data)) {
          setSuppliers(res.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Supplier Directory
              </h2>
              <p className="text-[11px] text-slate-400">
                Key vendor contact details
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/suppliers")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1 cursor-pointer transition"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {loading ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Loading suppliers...
            </div>
          ) : suppliers.length > 0 ? (
            suppliers.map((sup, idx) => (
              <div
                key={sup.supplierId || idx}
                className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    {sup.supplierName}
                  </h4>
                  {sup.phone && (
                    <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <Phone size={10} className="text-slate-400" />
                      {sup.phone}
                    </p>
                  )}
                </div>

                {sup.email && (
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 bg-white border border-slate-200/60 px-2 py-1 rounded-lg">
                      <Mail size={10} className="text-slate-400" />
                      {sup.email}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No suppliers found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuppliersCard;
