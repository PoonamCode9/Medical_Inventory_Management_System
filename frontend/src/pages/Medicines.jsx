import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiAlertCircle, FiList, FiGrid } from 'react-icons/fi';

const Medicines = () => {
  const { user, hasRole } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    categoryId: '',
    supplierId: '',
    description: '',
    costPrice: 0,
    sellingPrice: 0,
    minStockAlert: 10,
    stockQuantity: 0
  });

  // Batch details view states
  const [selectedMedBatches, setSelectedMedBatches] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isPharmacist = user?.role === 'ROLE_PHARMACIST';
  const canEdit = isAdmin || isPharmacist;

  const fetchData = async () => {
    try {
      const [medRes, catRes, supRes] = await Promise.all([
        API.get('/api/medicines'),
        API.get('/api/categories'),
        API.get('/api/suppliers')
      ]);
      setMedicines(medRes.data);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      setError('Failed to fetch data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      fetchData();
      return;
    }
    try {
      const res = await API.get(`/api/medicines/search?query=${q}`);
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      genericName: '',
      categoryId: categories[0]?.id || '',
      supplierId: suppliers[0]?.id || '',
      description: '',
      costPrice: '',
      sellingPrice: '',
      minStockAlert: 10,
      stockQuantity: 0
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (med) => {
    setEditingId(med.id);
    setFormData({
      name: med.name,
      genericName: med.genericName || '',
      categoryId: med.categoryId || '',
      supplierId: med.supplierId || '',
      description: med.description || '',
      costPrice: med.costPrice,
      sellingPrice: med.sellingPrice,
      minStockAlert: med.minStockAlert,
      stockQuantity: med.stockQuantity
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.supplierId) {
      setError('Please fill in Name, Category and Supplier fields');
      return;
    }

    try {
      if (editingId) {
        await API.put(`/api/medicines/${editingId}`, formData);
        setSuccess('Medicine updated successfully!');
      } else {
        await API.post('/api/medicines', formData);
        setSuccess('New medicine added to catalog!');
      }
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving medicine.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine? This will delete all associated batches.')) return;
    try {
      await API.delete(`/api/medicines/${id}`);
      setSuccess('Medicine removed from catalog');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete medicine');
    }
  };

  const viewBatches = async (med) => {
    setSelectedMedBatches(med);
    setLoadingBatches(true);
    try {
      const res = await API.get(`/api/inventory/medicine/${med.id}`);
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBatches(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Medicine Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">Add, update, search medicines catalog and check batch numbers.</p>
        </div>
        {canEdit && (
          <button 
            onClick={openAddModal} 
            className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/15 transition-all"
          >
            <FiPlus size={16} />
            <span>Add Medicine</span>
          </button>
        )}
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 items-center space-x-3 max-w-md">
        <FiSearch className="text-slate-500" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by medicine or generic formula..."
          className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-slate-500 text-slate-200"
        />
      </div>

      {/* Main Grid: Medicine catalog list & batch breakdown panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : medicines.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No medicines found in catalog. Add one to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="px-5 py-3.5">Medicine Name</th>
                    <th className="px-5 py-3.5">Formula (Generic)</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5 text-right">Selling Price</th>
                    <th className="px-5 py-3.5 text-center">Stock Level</th>
                    <th className="px-5 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {medicines.map((med) => {
                    const isLow = med.stockQuantity < med.minStockAlert;
                    return (
                      <tr key={med.id} className="hover:bg-slate-850/20 text-slate-300">
                        <td className="px-5 py-3.5 font-semibold text-slate-100">{med.name}</td>
                        <td className="px-5 py-3.5 italic text-slate-400">{med.genericName || 'N/A'}</td>
                        <td className="px-5 py-3.5">{med.categoryName}</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-slate-200">₹{med.sellingPrice}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${isLow ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {isLow && <FiAlertCircle className="mr-1" />}
                            {med.stockQuantity} Left
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center flex justify-center space-x-2">
                          <button 
                            onClick={() => viewBatches(med)} 
                            className="p-1.5 text-slate-400 hover:text-teal-400 bg-slate-850 rounded-lg"
                            title="View Batches"
                          >
                            <FiList size={14} />
                          </button>
                          {canEdit && (
                            <button 
                              onClick={() => openEditModal(med)} 
                              className="p-1.5 text-slate-400 hover:text-indigo-400 bg-slate-850 rounded-lg"
                              title="Edit"
                            >
                              <FiEdit size={14} />
                            </button>
                          )}
                          {isAdmin && (
                            <button 
                              onClick={() => handleDelete(med.id)} 
                              className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-850 rounded-lg"
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Batch details panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[450px] flex flex-col">
          <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center">
            <FiGrid className="text-teal-400 mr-2" /> Batch Breakdown
          </h3>

          {!selectedMedBatches ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center text-slate-500 text-xs px-6">
              <FiList size={36} className="text-slate-700 mb-3" />
              Select a medicine from the list to inspect batch details, expiry dates, and shelf locations.
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="mb-4">
                <h4 className="font-bold text-sm text-slate-200">{selectedMedBatches.name}</h4>
                <p className="text-[10px] text-slate-400">Total Stock: {selectedMedBatches.stockQuantity} unit(s)</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {loadingBatches ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : batches.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-10">
                    No active batches found in inventory.
                  </div>
                ) : (
                  batches.map((b) => (
                    <div key={b.id} className="p-3.5 bg-slate-850/40 border border-slate-800 rounded-2xl space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">Batch: {b.batchNumber}</span>
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 font-bold text-[10px]">
                          Qty: {b.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Expires: {b.expiryDate}</span>
                        <span>Shelf: {b.location || 'General'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <h3 className="font-bold text-base text-slate-200">
                {editingId ? 'Edit Medicine Details' : 'Add New Medicine to Catalog'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Medicine Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Paracetamol 650mg"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Generic Formula Name</label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                    placeholder="Paracetamol"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Supplier *</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Cost Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                    placeholder="12.50"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value) || 0})}
                    placeholder="15.00"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Low Stock Limit *</label>
                  <input
                    type="number"
                    required
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({...formData, minStockAlert: parseInt(e.target.value) || 10})}
                    placeholder="20"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Description / Indications</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Pain relief, reducing fever..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none h-20 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg shadow-teal-600/15"
                >
                  {editingId ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable X icon helper
const FiX = ({ size }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Medicines;
