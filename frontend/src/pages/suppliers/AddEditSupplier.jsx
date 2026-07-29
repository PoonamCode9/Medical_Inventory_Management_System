import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';

export default function AddEditSupplier() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { triggerToast } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form Fields
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('Active');

  // Errors state
  const [formErrors, setFormErrors] = useState({});

  // Input refs for focus
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  const fetchSupplierDetails = async () => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/suppliers/${id}`);
      if (res.data && res.data.success) {
        const s = res.data.data;
        setSupplierName(s.supplierName || '');
        setContactPerson(s.contactPerson || '');
        setPhone(s.phone || '');
        setEmail(s.email || '');
        setAddress(s.address || '');
        setStatus(s.status ? 'Active' : 'Inactive');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to fetch supplier profile.', 'DANGER');
      navigate('/suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierDetails();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!supplierName.trim()) {
      errors.supplierName = 'Supplier Name is required.';
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Invalid Email address format.';
      }
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(phone.trim().replace(/\s+/g, ''))) {
        errors.phone = 'Invalid Phone number format (Must be 10-15 digits).';
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.supplierName) nameRef.current?.focus();
      else if (errors.phone) phoneRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const payload = {
      supplierName: supplierName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      status: status === 'Active'
    };

    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/api/suppliers/${id}`, payload);
      } else {
        res = await api.post('/api/suppliers', payload);
      }

      if (res.data && res.data.success) {
        triggerToast(
          isEditMode ? 'Supplier profile updated successfully.' : 'Supplier registered successfully.',
          'SUCCESS'
        );
        navigate('/suppliers');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Unable to submit supplier details.';
      handleBackendErrors(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBackendErrors = (msg) => {
    const errors = {};
    if (msg.toLowerCase().includes('name already exists')) {
      errors.supplierName = 'Supplier Name already exists in records.';
      nameRef.current?.focus();
    } else if (msg.toLowerCase().includes('email already exists')) {
      errors.email = 'Supplier Email already exists in records.';
      emailRef.current?.focus();
    } else if (msg.toLowerCase().includes('phone number already exists') || msg.toLowerCase().includes('phone already exists')) {
      errors.phone = 'Supplier Phone number already exists in records.';
      phoneRef.current?.focus();
    } else {
      triggerToast(msg, 'DANGER');
    }
    setFormErrors(prev => ({ ...prev, ...errors }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-4 border-teal-650 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-sans pb-10">
      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Update Supplier Profile' : 'Register New Supplier'}
          </h1>
          <p className="text-xs text-gray-500">Record wholesale manufacturers, track vendor contacts, and register locations.</p>
        </div>
        <Link
          to="/suppliers"
          className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer transition-colors"
        >
          &larr; Back to List
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-[10px] p-6 shadow-sm space-y-5 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Supplier Name *</label>
          <input
            ref={nameRef}
            type="text"
            required
            className={`w-full bg-white border rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
              formErrors.supplierName ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
            }`}
            placeholder="e.g. Acme Pharma Inc"
            value={supplierName}
            onChange={(e) => {
              setSupplierName(e.target.value);
              setFormErrors(prev => ({ ...prev, supplierName: null }));
            }}
          />
          {formErrors.supplierName && (
            <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.supplierName}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Contact Person</label>
          <input
            type="text"
            className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
            placeholder="e.g. John Doe"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Phone Number</label>
            <input
              ref={phoneRef}
              type="text"
              className={`w-full bg-white border rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                formErrors.phone ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
              }`}
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setFormErrors(prev => ({ ...prev, phone: null }));
              }}
            />
            {formErrors.phone ? (
              <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.phone}</p>
            ) : (
              <p className="text-[9px] text-gray-400 mt-1">10-15 digit number format.</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
            <input
              ref={emailRef}
              type="text"
              className={`w-full bg-white border rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                formErrors.email ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
              }`}
              placeholder="e.g. orders@acmepharma.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormErrors(prev => ({ ...prev, email: null }));
              }}
            />
            {formErrors.email && (
              <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Status</label>
          <select
            className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 font-medium"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Physical Address</label>
          <textarea
            className="w-full bg-white border border-gray-300 rounded-[10px] p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 font-medium"
            rows="3"
            placeholder="Street details, building number, zip..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Action buttons */}
        <div className="pt-3 border-t border-gray-150 flex justify-end space-x-2.5">
          <Link
            to="/suppliers"
            className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitLoading}
            className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {isEditMode ? 'Save Profile' : 'Register Supplier'}
          </button>
        </div>
      </form>
    </div>
  );
}
