import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

export default function Medicines() {
  const navigate = useNavigate();
  const { triggerToast } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const roleName = user?.role || '';
  const canWrite = roleName.includes('ADMIN') || roleName.includes('PHARMACIST');
  const isAdmin = roleName.includes('ADMIN');

  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Search & Filter state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [expiryFilter, setExpiryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [medsRes, catsRes, suppsRes] = await Promise.all([
        api.get('/api/medicines').catch(() => null),
        api.get('/api/categories').catch(() => null),
        api.get('/api/suppliers').catch(() => null)
      ]);

      if (medsRes && medsRes.data && Array.isArray(medsRes.data.data)) {
        setMedicines(medsRes.data.data);
      }
      if (catsRes && catsRes.data && Array.isArray(catsRes.data.data)) {
        setCategories(catsRes.data.data);
      }
      if (suppsRes && suppsRes.data && Array.isArray(suppsRes.data.data)) {
        setSuppliers(suppsRes.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to load catalog details.', 'DANGER');
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchCatalogData();

    const handleWriteSuccess = () => {
      console.log('Real-time sync: reloading medicines catalog data');
      fetchCatalogData();
    };

    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Security confirmation: Are you sure you want to permanently delete medicine "${name}"?`)) {
      try {
        const res = await api.delete(`/api/medicines/${id}`);
        if (res.data && res.data.success) {
          triggerToast('Medicine entry deleted successfully.', 'SUCCESS');
          fetchCatalogData();
        }
      } catch (err) {
        console.error(err);
        triggerToast(err.response?.data?.message || 'Unable to delete medicine.', 'DANGER');
      }
    }
  };

  const handleExportCSV = () => {
    if (filteredMeds.length === 0) {
      triggerToast('No records available to export.', 'WARNING');
      return;
    }

    const headers = [
      'Medicine ID',
      'Medicine Name',
      'Generic Name',
      'Category',
      'Supplier',
      'Supplier Phone',
      'Supplier Email',
      'Batch Number',
      'Dosage',
      'Unit',
      'Mfg Date',
      'Expiry Date',
      'Purchase Price',
      'Selling Price',
      'Quantity',
      'Min Stock',
      'Barcode'
    ];

    const rows = filteredMeds.map(m => [
      m.medicineId,
      `"${m.medicineName.replace(/"/g, '""')}"`,
      `"${(m.genericName || '').replace(/"/g, '""')}"`,
      `"${m.categoryName}"`,
      `"${m.supplierName}"`,
      `"${m.supplierPhone || ''}"`,
      `"${m.supplierEmail || ''}"`,
      `"${m.batchNumber}"`,
      `"${m.dosage}"`,
      `"${m.unit}"`,
      m.manufactureDate,
      m.expiryDate,
      m.purchasePrice,
      m.sellingPrice,
      m.quantity,
      m.minimumStock,
      `"${m.barcode || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medistock_catalog_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Advanced Filtering
  const filteredMeds = medicines.filter((m) => {
    // 1. Search Query mapping
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      m.medicineName.toLowerCase().includes(q) ||
      (m.genericName || '').toLowerCase().includes(q) ||
      (m.batchNumber || '').toLowerCase().includes(q);

    // 2. Category selection mapping
    const matchesCategory = categoryFilter === 'ALL' || m.categoryName === categoryFilter;

    // 3. Supplier selection mapping
    const matchesSupplier = supplierFilter === 'ALL' || m.supplierName === supplierFilter;

    // 4. Expiry timeline classification mapping
    let matchesExpiry = true;
    if (expiryFilter !== 'ALL' && m.expiryDate) {
      const exp = new Date(m.expiryDate);
      const today = new Date();
      const diffMs = exp.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (expiryFilter === 'EXPIRED') {
        matchesExpiry = diffDays <= 0;
      } else if (expiryFilter === '7_DAYS') {
        matchesExpiry = diffDays > 0 && diffDays <= 7;
      } else if (expiryFilter === '15_DAYS') {
        matchesExpiry = diffDays > 0 && diffDays <= 15;
      } else if (expiryFilter === '30_DAYS') {
        matchesExpiry = diffDays > 0 && diffDays <= 30;
      }
    }

    // 5. Stock Level buffer categorization
    let matchesStock = true;
    if (stockFilter === 'OUT_OF_STOCK') {
      matchesStock = m.quantity === 0;
    } else if (stockFilter === 'LOW_STOCK') {
      matchesStock = m.quantity > 0 && m.quantity <= m.minimumStock;
    } else if (stockFilter === 'GOOD_STOCK') {
      matchesStock = m.quantity > m.minimumStock;
    }

    return matchesSearch && matchesCategory && matchesSupplier && matchesExpiry && matchesStock;
  });

  // Pagination slicing
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeds = filteredMeds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMeds.length / itemsPerPage);

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-3.5"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-3.5"><div className="h-4 bg-gray-150 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-100 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-4 bg-gray-150 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-100 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-100 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-250 rounded w-1/4"></div></td>
      <td className="p-3.5"><div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
    </tr>
  );

  return (
    <div className="space-y-6 animate-fade-in min-h-screen pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Medicine Stock Registry</h1>
          <p className="text-xs text-gray-500">Monitor storage details, modify inventory settings, and review procurement records.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="py-2 px-3 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer flex items-center gap-1.5"
            title="Download CSV Catalog"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          
          {canWrite && (
            <Link
              to="/medicines/new"
              className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Medicine
            </Link>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 items-end font-sans">
        {/* Search */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Search Product</label>
          <div className="relative">
            <input
              type="text"
              className="w-full bg-white border border-gray-300 p-2 pl-8 text-xs rounded-card focus:outline-none focus:border-teal-700 font-medium"
              placeholder="Brand, generic, or batch..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
          <select
            className="w-full bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-semibold"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
            ))}
          </select>
        </div>

        {/* Supplier Filter */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Supplier</label>
          <select
            className="w-full bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-semibold"
            value={supplierFilter}
            onChange={(e) => { setSupplierFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Suppliers</option>
            {suppliers.map((s) => (
              <option key={s.supplierId} value={s.supplierName}>{s.supplierName}</option>
            ))}
          </select>
        </div>

        {/* Expiry Urgency Filter */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Expiry timeline</label>
          <select
            className="w-full bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-semibold"
            value={expiryFilter}
            onChange={(e) => { setExpiryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Batches</option>
            <option value="EXPIRED">Expired Batches</option>
            <option value="7_DAYS">Expires in 7 Days</option>
            <option value="15_DAYS">Expires in 15 Days</option>
            <option value="30_DAYS">Expires in 30 Days</option>
          </select>
        </div>

        {/* Stock Level Filter */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Stock Buffer</label>
          <select
            className="w-full bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-semibold"
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Items</option>
            <option value="OUT_OF_STOCK">Out of Stock (Zero)</option>
            <option value="LOW_STOCK">Low Stock (Under min)</option>
            <option value="GOOD_STOCK">Optimal Stock (Normal)</option>
          </select>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 font-bold">Medicine Details</th>
                <th className="p-3.5 font-bold">Batch & Barcode</th>
                <th className="p-3.5 font-bold">Dosage & Unit</th>
                <th className="p-3.5 font-bold">Category</th>
                <th className="p-3.5 font-bold">Expiry Date</th>
                <th className="p-3.5 font-bold text-right">Selling Price</th>
                <th className="p-3.5 font-bold text-center">Qty / Min</th>
                <th className="p-3.5 font-bold">Supplier</th>
                <th className="p-3.5 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-400 font-sans font-semibold">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="w-6 h-6 border-2 border-teal-650 border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading medicines...</span>
                    </div>
                  </td>
                </tr>
              ) : currentMeds.length > 0 ? (
                currentMeds.map((med) => {
                  const isOut = med.quantity === 0;
                  const isLow = med.quantity <= med.minimumStock;
                  return (
                    <tr key={med.medicineId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-gray-850">{med.medicineName}</div>
                        <div className="text-[10px] text-gray-400 font-medium">Generic: {med.genericName || 'None'}</div>
                      </td>
                      <td className="p-3.5 font-mono text-gray-650">
                        <div className="font-semibold">{med.batchNumber}</div>
                        <div className="text-[9px] text-gray-400">{med.barcode || 'No barcode'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-gray-700">{med.dosage || 'N/A'}</div>
                        <div className="text-[10px] text-gray-400">{med.unit}</div>
                      </td>
                      <td className="p-3.5 text-gray-600 font-semibold">{med.categoryName}</td>
                      <td className="p-3.5 font-mono">
                        <div className="text-gray-650">{med.expiryDate}</div>
                        {med.expiryStatus && (
                          <div className="mt-1">
                            <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase ${
                              med.expiryStatus === 'Expired'
                                ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse'
                                : med.expiryStatus === 'Critical'
                                ? 'bg-orange-50 text-orange-700 border border-orange-150'
                                : med.expiryStatus === 'Expiring Soon'
                                ? 'bg-amber-50 text-amber-700 border border-amber-150'
                                : 'bg-green-50 text-green-700 border border-green-150'
                            }`}>
                              {med.expiryStatus}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-gray-800 text-right">₹{med.sellingPrice?.toLocaleString('en-IN') || '0.00'}</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${
                          isOut 
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : isLow 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-teal-50 text-teal-700 border border-teal-100'
                        }`}>
                          {med.quantity} / {med.minimumStock}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-500 font-medium">
                        <div className="font-bold text-gray-800">{med.supplierName}</div>
                        {med.supplierPhone && (
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{med.supplierPhone}</div>
                        )}
                        {med.supplierEmail && (
                          <div className="text-[9px] text-gray-400 lowercase truncate max-w-[125px]" title={med.supplierEmail}>
                            {med.supplierEmail}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center space-x-1.5">
                          {canWrite && (
                            <Link
                              to={`/medicines/${med.medicineId}/edit`}
                              className="p-1.5 text-gray-500 hover:text-teal-755 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Edit Medicine Record"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Link>
                          )}
                          {canWrite && (
                            <button
                              onClick={() => handleDeleteClick(med.medicineId, med.medicineName)}
                              className="p-1.5 text-gray-500 hover:text-red-755 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Delete Medicine"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-400 bg-slate-50/20 font-sans">
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-4xl mb-3">📦</span>
                      <h4 className="text-sm font-bold text-gray-700">No medicines available.</h4>
                      <p className="text-xs text-gray-400 mt-1 mb-4">Start by adding your first medicine details to registry.</p>
                      <Link
                        to="/medicines/new"
                        className="py-1.5 px-3.5 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs cursor-pointer shadow-sm"
                      >
                        + Register Medicine
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-slate-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between font-sans">
            <span className="text-xs text-gray-500">
              Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredMeds.length)}</span> of <span className="font-semibold">{filteredMeds.length}</span> items
            </span>
            
            <div className="flex space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-2 py-1 text-xs border border-gray-300 rounded-card font-medium text-gray-600 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-xs border rounded-card font-bold transition-all ${
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
                className="px-2 py-1 text-xs border border-gray-300 rounded-card font-medium text-gray-600 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
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
