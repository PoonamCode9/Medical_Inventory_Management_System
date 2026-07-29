import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

export default function Categories() {
  const { triggerToast } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const roleName = user?.role || '';
  const canWrite = roleName.includes('ADMIN');
  const isAdmin = roleName.includes('ADMIN');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form Fields
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/categories');
      if (res.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load category records.', 'DANGER');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!categoryName.trim()) {
      errors.categoryName = 'Category Name is required.';
    }
    
    // Check local duplicate before sending (only for new creation)
    if (!editingId) {
      const isDuplicate = categories.some(
        (c) => c.categoryName.trim().toLowerCase() === categoryName.trim().toLowerCase()
      );
      if (isDuplicate) {
        errors.categoryName = 'Category already exists.';
      }
    } else {
      const isDuplicate = categories.some(
        (c) => c.categoryId !== editingId && c.categoryName.trim().toLowerCase() === categoryName.trim().toLowerCase()
      );
      if (isDuplicate) {
        errors.categoryName = 'Category already exists.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const payload = {
      categoryName: categoryName.trim(),
      description: description.trim()
    };

    try {
      await api.post('/api/categories', payload);
      triggerToast('Category created successfully.', 'SUCCESS');
      resetForm();
      fetchCategories();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unable to create category.';
      if (errMsg.toLowerCase().includes('duplicate') || errMsg.toLowerCase().includes('exists')) {
        setFormErrors({ categoryName: 'Category already exists.' });
      } else {
        triggerToast(errMsg, 'DANGER');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (c) => {
    setEditingId(c.categoryId);
    setCategoryName(c.categoryName || '');
    setDescription(c.description || '');
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const payload = {
      categoryName: categoryName.trim(),
      description: description.trim()
    };

    try {
      await api.put(`/api/categories/${editingId}`, payload);
      triggerToast('Category details updated successfully.', 'SUCCESS');
      resetForm();
      fetchCategories();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unable to update category.';
      if (errMsg.toLowerCase().includes('duplicate') || errMsg.toLowerCase().includes('exists')) {
        setFormErrors({ categoryName: 'Category already exists.' });
      } else {
        triggerToast(errMsg, 'DANGER');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await api.delete(`/api/categories/${id}`);
        triggerToast('Category deleted successfully.', 'SUCCESS');
        fetchCategories();
      } catch (err) {
        triggerToast(err.response?.data?.message || 'Unable to delete category.', 'DANGER');
      }
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setEditingId(null);
    setFormErrors({});
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const filteredCategories = categories.filter(c => {
    return c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-3.5"><div className="h-3.5 bg-gray-200 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-150 rounded w-2/3"></div></td>
      <td className="p-3.5 text-center"><div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div></td>
    </tr>
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Medicine Categories Registry</h1>
          <p className="text-xs text-gray-500">Classify pharmaceutical formulations and manage therapeutic category labels.</p>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowAddModal(true)}
            className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            className="w-full bg-white border border-gray-300 p-2.5 pl-8 text-xs rounded-card focus:outline-none focus:border-teal-700 font-medium"
            placeholder="Search by category name, description..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table Grid */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 font-bold">Category Name</th>
                <th className="p-3.5 font-bold">Description</th>
                <th className="p-3.5 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-400 font-sans font-semibold">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="w-6 h-6 border-2 border-teal-650 border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : currentCategories.length > 0 ? (
                currentCategories.map((c) => (
                  <tr key={c.categoryId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-805">{c.categoryName}</td>
                    <td className="p-3.5 text-gray-500 font-medium max-w-md truncate">{c.description || 'No description provided.'}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {canWrite && (
                          <button
                            onClick={() => handleEditClick(c)}
                            className="p-1.5 text-gray-500 hover:text-teal-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteClick(c.categoryId, c.categoryName)}
                            className="p-1.5 text-gray-500 hover:text-red-750 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Category"
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
                  <td colSpan="3" className="text-center py-16 text-gray-400 bg-slate-50/20">
                    <div className="flex flex-col justify-center items-center font-sans">
                      <span className="text-4xl mb-3">📋</span>
                      <h4 className="text-sm font-bold text-gray-700">No categories found.</h4>
                      <p className="text-xs text-gray-400 mt-1 mb-4">Register categories to group formulations.</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="py-1.5 px-3.5 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs cursor-pointer shadow-sm transition-colors"
                      >
                        + Create Category
                      </button>
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
              Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, filteredCategories.length)}</span> of <span className="font-bold">{filteredCategories.length}</span> registered categories
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

      {/* MODAL 1: ADD CATEGORY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-[10px] border border-gray-200 shadow-xl w-full max-w-md overflow-hidden font-sans">
            <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Create Category Profile</h3>
              <button onClick={resetForm} className="text-gray-405 hover:text-gray-600 font-bold cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  className={`w-full bg-white border rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                    formErrors.categoryName ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Antibiotics, Vitamins"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setFormErrors(prev => ({ ...prev, categoryName: null }));
                  }}
                />
                {formErrors.categoryName && (
                  <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.categoryName}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  className="w-full bg-white border border-gray-300 rounded-[10px] p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                  rows="3"
                  placeholder="Describe target usage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-gray-150 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitLoading && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CATEGORY */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-[10px] border border-gray-200 shadow-xl w-full max-w-md overflow-hidden font-sans">
            <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Update Category Details</h3>
              <button onClick={resetForm} className="text-gray-405 hover:text-gray-600 font-bold cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  className={`w-full bg-white border rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                    formErrors.categoryName ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                  }`}
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setFormErrors(prev => ({ ...prev, categoryName: null }));
                  }}
                />
                {formErrors.categoryName && (
                  <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.categoryName}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  className="w-full bg-white border border-gray-300 rounded-[10px] p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-gray-150 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitLoading && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
