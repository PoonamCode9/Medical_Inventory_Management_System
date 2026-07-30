import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const Categories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isPharmacist = user?.role === 'ROLE_PHARMACIST';
  const canEdit = isAdmin || isPharmacist;

  const fetchCategories = async () => {
    try {
      const res = await API.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Category Name is required');
      return;
    }

    try {
      if (editingId) {
        await API.put(`/api/categories/${editingId}`, { name, description });
        setSuccess('Category updated successfully');
      } else {
        await API.post('/api/categories', { name, description });
        setSuccess('Category added successfully');
      }
      setShowModal(false);
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? Medicines matching this category will have category unassigned.')) return;
    try {
      await API.delete(`/api/categories/${id}`);
      setSuccess('Category deleted successfully');
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Medicine Categories</h1>
          <p className="text-xs text-slate-400 mt-1">Configure therapeutic categories for classifying medicines.</p>
        </div>
        {canEdit && (
          <button 
            onClick={openAddModal} 
            className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/15 transition-all"
          >
            <FiPlus size={16} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No categories registered. Add one to classify inventory!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold">
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-355 text-slate-300">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-850/20">
                    <td className="px-6 py-4 font-semibold text-slate-100">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-400">{cat.description || 'No description available'}</td>
                    <td className="px-6 py-4 text-center flex justify-center space-x-3">
                      {canEdit && (
                        <button 
                          onClick={() => openEditModal(cat)} 
                          className="p-1.5 text-slate-400 hover:text-indigo-400 bg-slate-850 rounded-lg"
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(cat.id)} 
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
                {editingId ? 'Edit Category' : 'Create New Category'}
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
                <label className="block font-semibold text-slate-400 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Antibiotics"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Medications targeting bacterial infections..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 focus:outline-none h-24 resize-none"
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
                  {editingId ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
