import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

export default function Suppliers() {
  const { triggerToast } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const roleName = user?.role || '';
  const canWrite = roleName.includes('ADMIN');
  const isAdmin = roleName.includes('ADMIN');

  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/suppliers');
      if (res.data && Array.isArray(res.data.data)) {
        setSuppliers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load supplier records.', 'DANGER');
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete supplier "${name}"?`)) {
      try {
        await api.delete(`/api/suppliers/${id}`);
        triggerToast('Supplier record deleted successfully.', 'SUCCESS');
        fetchSuppliers();
      } catch (err) {
        console.error(err);
        triggerToast(err.response?.data?.message || 'Unable to delete supplier.', 'DANGER');
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s => {
    return s.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (s.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (s.email || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-3.5"><div className="h-3.5 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-150 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-100 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-150 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-100 rounded w-1/2"></div></td>
      <td className="p-3.5 text-center"><div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
    </tr>
  );

  return (
    <div className="space-y-6 font-sans min-h-screen pb-10">
      {/* Header Banner */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Affiliated Suppliers & Labs Directory</h1>
          <p className="text-xs text-gray-500">Record wholesale manufacturers, track vendor performance metrics, and review active contacts.</p>
        </div>
        
        {canWrite && (
          <Link
            to="/suppliers/new"
            className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Supplier
          </Link>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            className="w-full bg-white border border-gray-300 p-2.5 pl-8 text-xs rounded-card focus:outline-none focus:border-teal-700 font-medium"
            placeholder="Search by vendor name, contact person..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 font-bold">Supplier Name</th>
                <th className="p-3.5 font-bold">Contact Person</th>
                <th className="p-3.5 font-bold">Phone</th>
                <th className="p-3.5 font-bold">Email</th>
                <th className="p-3.5 font-bold">Registered Address</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400 font-sans font-semibold">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="w-6 h-6 border-2 border-teal-650 border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading suppliers...</span>
                    </div>
                  </td>
                </tr>
              ) : currentSuppliers.length > 0 ? (
                currentSuppliers.map((s) => (
                  <tr key={s.supplierId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-805">{s.supplierName}</td>
                    <td className="p-3.5 text-gray-600 font-semibold">{s.contactPerson || 'N/A'}</td>
                    <td className="p-3.5 text-gray-500 font-mono text-[11px]">{s.phone || 'N/A'}</td>
                    <td className="p-3.5 text-gray-600 font-semibold">{s.email || 'N/A'}</td>
                    <td className="p-3.5 text-gray-500 font-medium max-w-xs truncate">{s.address || 'N/A'}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center text-[10px] font-bold ${
                        s.status ? 'text-green-600 border border-green-100 bg-green-50/40 px-2 py-0.5 rounded-[5px]' : 'text-red-500 border border-red-100 bg-red-50/40 px-2 py-0.5 rounded-[5px]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          s.status ? 'bg-green-500' : 'bg-red-400'
                        }`}></span>
                        {s.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {canWrite && (
                          <Link
                            to={`/suppliers/${s.supplierId}/edit`}
                            className="p-1.5 text-gray-500 hover:text-teal-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Link>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteClick(s.supplierId, s.supplierName)}
                            className="p-1.5 text-gray-500 hover:text-red-755 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Supplier"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-400 bg-slate-50/20">
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-4xl mb-3">📦</span>
                      <h4 className="text-sm font-bold text-gray-700">No suppliers found.</h4>
                      <p className="text-xs text-gray-400 mt-1 mb-4">Coordinate and add wholesale distributors to get started.</p>
                      <Link
                        to="/suppliers/new"
                        className="py-1.5 px-3.5 bg-[#0F766E] hover:bg-teal-800 text-white font-semibold rounded-card text-xs cursor-pointer shadow-sm transition-colors"
                      >
                        + Add Supplier
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-slate-50 border-t border-gray-200 px-4 py-3.5 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, filteredSuppliers.length)}</span> of <span className="font-bold">{filteredSuppliers.length}</span> registered suppliers
            </span>
            <div className="flex space-x-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-2.5 py-1 text-xs border border-gray-300 rounded-card font-medium text-gray-655 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-xs border rounded-card font-bold transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-[#0F766E] border-[#0F766E] text-white'
                      : 'border-gray-300 text-gray-600 bg-white hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-2.5 py-1 text-xs border border-gray-300 rounded-card font-medium text-gray-655 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
