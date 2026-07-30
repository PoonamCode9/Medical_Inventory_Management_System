import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const Suppliers = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isPharmacist = user?.role === 'ROLE_PHARMACIST';
  const canEdit = isAdmin || isPharmacist;

  const fetchSuppliers = async () => {
    try {
      const res = await API.get('/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      setError('Failed to fetch suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (sup) => {
    setEditingId(sup.id);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Supplier Name is required');
      return;
    }

    try {
      if (editingId) {
        await API.put(`/api/suppliers/${editingId}`, formData);
        setSuccess('Supplier details updated successfully');
      } else {
        await API.post('/api/suppliers', formData);
        setSuccess('New supplier registered successfully');
      }
      setShowModal(false);
      fetchSuppliers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save supplier details');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete supplier? Associated medicines will have supplier unassigned.')) return;
    try {
      await API.delete(`/api/suppliers/${id}`);
      setSuccess('Supplier removed successfully');
      fetchSuppliers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete supplier');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Suppliers Registry</h1>
          <p className="text-xs text-slate-400 mt-1">Manage pharmaceutical manufacturers, distributors and logistics contacts.</p>
        </div>
        {canEdit && (
          <button 
            onClick={openAddModal} 
            className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/15 transition-all"
          >
            <FiPlus size={16} />
            <span>Register Supplier</span>
          </button>
        )}
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No suppliers registered in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold">
                  <th className="px-5 py-3.5">Supplier Name</th>
                  <th className="px-5 py-3.5">Contact Person</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Phone Number</th>
                  <th className="px-5 py-3.5">Address</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {suppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-850/20">
                    <td className="px-5 py-3.5 font-semibold text-slate-100">{sup.name}</td>
                    <td className="px-5 py-3.5">{sup.contactPerson || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-slate-400">{sup.email || 'N/A'}</td>
                    <td className="px-5 py-3.5">{sup.phone || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-slate-400">{sup.address || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-center flex justify-center space-x-2">
                      {canEdit && (
                        <button 
                          onClick={() => openEditModal(sup)} 
                          className="p-1.5 text-slate-400 hover:text-indigo-400 bg-slate-850 rounded-lg"
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(sup.id)} 
                          className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-850 rounded-lg"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <h3 className="font-bold text-base text-slate-200">
                {editingId ? 'Edit Supplier Details' : 'Register New Supplier'}
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
              <div>
                <label className="block font-semibold text-slate-400 mb-1.5">Supplier / Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Cipla Pharmaceuticals"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    placeholder="Dr. Rajesh"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="02224951234"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@cipla.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1.5">Corporate Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Mumbai, Maharashtra"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none"
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
                  {editingId ? 'Update details' : 'Register Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
