import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function UserManagement() {
  const { user: currentSessionUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Form / Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Add User State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('2'); // Default: Pharmacist (2)
  const [status, setStatus] = useState('Active');
  const [addErrors, setAddErrors] = useState({});

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  // Input refs for auto-focusing on the first invalid field
  const addNameRef = useRef(null);
  const addEmailRef = useRef(null);
  const addPhoneRef = useRef(null);
  const addPasswordRef = useRef(null);

  const editNameRef = useRef(null);
  const editEmailRef = useRef(null);
  const editPhoneRef = useRef(null);
  const editPasswordRef = useRef(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Alerts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('SUCCESS');

  const triggerToast = (msg, type = 'SUCCESS') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const getRoleName = (id) => {
    return id === 2 ? 'PHARMACIST' : 'VIEWER';
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users');
      if (response && response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        fallbackAdminUser();
      }
    } catch (err) {
      console.warn('GET /api/users failed, displaying Admin user fallback:', err);
      fallbackAdminUser();
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const fallbackAdminUser = () => {
    setUsers([
      {
        userId: 'admin-1',
        fullName: 'System Administrator',
        email: currentSessionUser?.email || 'admin@medistock.com',
        phone: '5550199999',
        role: 'ADMIN',
        status: 'Active',
        lastLogin: 'Just now'
      }
    ]);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentSessionUser]);

  // Client-Side Input Sanitizer
  const sanitizeInput = (val) => {
    if (!val) return '';
    // Collapse spacing and strip control/invisible characters
    let cleaned = val.replace(/[\p{Cc}\p{Cf}\p{Co}\p{Cn}]/gu, '');
    return cleaned.replace(/\s+/g, ' ').trim();
  };

  // Check XSS tags
  const isMalicious = (val) => {
    if (!val) return false;
    const lower = val.toLowerCase();
    return lower.includes('<script') || lower.includes('</script') || 
           lower.includes('<html') || lower.includes('<body') ||
           lower.includes('javascript:') || lower.includes('onload=') || 
           lower.includes('onerror=') || 
           /<[^>]+>/g.test(lower);
  };

  // Client-Side Field Validator
  const validateField = (name, value, isUpdate = false) => {
    let errorMsg = '';
    
    if (name === 'fullName') {
      const cleaned = sanitizeInput(value);
      if (!cleaned) {
        errorMsg = 'Full Name is required.';
      } else if (cleaned.length < 3 || cleaned.length > 60) {
        errorMsg = 'Full Name must be between 3 and 60 characters.';
      } else if (!/^[A-Za-z\s]+$/.test(cleaned)) {
        errorMsg = 'Name can only contain alphabets and spaces.';
      } else if (isMalicious(value)) {
        errorMsg = 'Name contains illegal script or tags.';
      }
    }
    
    if (name === 'email') {
      const cleaned = sanitizeInput(value);
      if (!cleaned) {
        errorMsg = 'Email Address is required.';
      } else if (cleaned.length > 100) {
        errorMsg = 'Email cannot exceed 100 characters.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
        errorMsg = 'Invalid email format.';
      } else if (isMalicious(value)) {
        errorMsg = 'Email contains illegal script or tags.';
      }
    }
    
    if (name === 'phone') {
      const cleaned = sanitizeInput(value);
      if (!cleaned) {
        errorMsg = 'Phone number is required.';
      } else if (!/^\d+$/.test(cleaned)) {
        errorMsg = 'Phone number must contain only numbers.';
      } else if (cleaned.length !== 10) {
        errorMsg = 'Phone number must contain exactly 10 digits.';
      }
    }
    
    if (name === 'password') {
      if (!isUpdate && !value) {
        errorMsg = 'Password is required.';
      } else if (value) {
        if (value.length < 8 || value.length > 30) {
          errorMsg = 'Password must be between 8 and 30 characters.';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}|[\]\\:;"'<>,.?/]).*$/.test(value)) {
          errorMsg = 'Password must contain uppercase, lowercase, number and special character.';
        }
      }
    }

    return errorMsg;
  };

  // Add Form Handlers
  const handleAddChange = (field, val) => {
    let cleanVal = val;
    if (field === 'email') {
      cleanVal = val.toLowerCase();
    }
    
    if (field === 'fullName') setFullName(cleanVal);
    if (field === 'email') setEmail(cleanVal);
    if (field === 'phone') setPhone(cleanVal);
    if (field === 'password') setPassword(cleanVal);

    const errorMsg = validateField(field, cleanVal, false);
    setAddErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  const isAddFormInvalid = () => {
    // Basic presence check
    if (!fullName || !email || !phone || !password) return true;
    
    // Check error values
    if (addErrors.fullName || addErrors.email || addErrors.phone || addErrors.password) return true;
    
    return false;
  };

  // Password Generator
  const handleGeneratePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specials = '!@#$%^&*()_+';
    
    let generated = '';
    // Guarantee complex requirements
    generated += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    generated += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    generated += numbers.charAt(Math.floor(Math.random() * numbers.length));
    generated += specials.charAt(Math.floor(Math.random() * specials.length));
    
    const allChars = uppercase + lowercase + numbers + specials;
    for (let i = 0; i < 6; i++) {
      generated += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    setPassword(generated);
    setAddErrors(prev => ({ ...prev, password: '' }));
  };

  // Add User Submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // 1. Double check validations on submit
    const nameErr = validateField('fullName', fullName, false);
    const emailErr = validateField('email', email, false);
    const phoneErr = validateField('phone', phone, false);
    const passErr = validateField('password', password, false);

    if (nameErr || emailErr || phoneErr || passErr) {
      setAddErrors({
        fullName: nameErr,
        email: emailErr,
        phone: phoneErr,
        password: passErr
      });

      // 2. Focus automatically on the first invalid field
      if (nameErr) addNameRef.current.focus();
      else if (emailErr) addEmailRef.current.focus();
      else if (phoneErr) addPhoneRef.current.focus();
      else if (passErr) addPasswordRef.current.focus();
      return;
    }

    setSubmitLoading(true);
    const payload = {
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email).toLowerCase(),
      phone: sanitizeInput(phone),
      password,
      roleId: parseInt(roleId, 10),
      status: status === 'Active'
    };

    try {
      const response = await api.post('/api/users', payload);
      if (response.data && response.data.success) {
        triggerToast('User created successfully.', 'SUCCESS');
        resetAddForm();
        fetchUsers();
      } else {
        triggerToast('Unable to create user.', 'DANGER');
      }
    } catch (err) {
      console.error('API Creation failed:', err);
      const errMsg = err.response?.data?.message || 'Unable to create user.';
      
      // Inline duplicate highlights
      if (errMsg.includes('Email') || errMsg.toLowerCase().includes('email')) {
        setAddErrors(prev => ({ ...prev, email: 'An account with this email already exists.' }));
        addEmailRef.current.focus();
      } else if (errMsg.includes('Phone') || errMsg.toLowerCase().includes('phone')) {
        setAddErrors(prev => ({ ...prev, phone: 'This phone number is already registered.' }));
        addPhoneRef.current.focus();
      }
      
      triggerToast(errMsg, 'DANGER');
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetAddForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRoleId('2');
    setStatus('Active');
    setAddErrors({});
    setShowAddModal(false);
  };

  // Edit Form Handlers
  const handleEditChange = (field, val) => {
    let cleanVal = val;
    if (field === 'email') {
      cleanVal = val.toLowerCase();
    }
    
    setEditingUser(prev => ({ ...prev, [field]: cleanVal }));

    const errorMsg = validateField(field, cleanVal, true);
    setEditErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  const isEditFormInvalid = () => {
    if (!editingUser) return true;
    if (!editingUser.fullName || !editingUser.email || !editingUser.phone) return true;
    if (editErrors.fullName || editErrors.email || editErrors.phone || editErrors.password) return true;
    return false;
  };

  const handleEditClick = (user) => {
    // Map role name back to standard database ID
    let rId = 2;
    if (user.role === 'VIEWER') rId = 3;
    
    setEditingUser({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      password: '',
      roleId: rId,
      status: user.status === 'Active'
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  // Edit User Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    // 1. Submit checks
    const nameErr = validateField('fullName', editingUser.fullName, true);
    const emailErr = validateField('email', editingUser.email, true);
    const phoneErr = validateField('phone', editingUser.phone, true);
    const passErr = validateField('password', editingUser.password, true);

    if (nameErr || emailErr || phoneErr || passErr) {
      setEditErrors({
        fullName: nameErr,
        email: emailErr,
        phone: phoneErr,
        password: passErr
      });

      if (nameErr) editNameRef.current.focus();
      else if (emailErr) editEmailRef.current.focus();
      else if (phoneErr) editPhoneRef.current.focus();
      else if (passErr) editPasswordRef.current.focus();
      return;
    }

    setSubmitLoading(true);
    const payload = {
      fullName: sanitizeInput(editingUser.fullName),
      email: sanitizeInput(editingUser.email).toLowerCase(),
      phone: sanitizeInput(editingUser.phone),
      password: editingUser.password || null,
      roleId: editingUser.roleId,
      status: editingUser.status
    };

    try {
      const response = await api.put(`/api/users/${editingUser.userId}`, payload);
      if (response.data && response.data.success) {
        triggerToast('User updated successfully.', 'SUCCESS');
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        triggerToast('Unable to update user.', 'DANGER');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Unable to update user.';
      
      if (errMsg.includes('Email') || errMsg.toLowerCase().includes('email')) {
        setEditErrors(prev => ({ ...prev, email: 'An account with this email already exists.' }));
        editEmailRef.current.focus();
      } else if (errMsg.includes('Phone') || errMsg.toLowerCase().includes('phone')) {
        setEditErrors(prev => ({ ...prev, phone: 'This phone number is already registered.' }));
        editPhoneRef.current.focus();
      }
      
      triggerToast(errMsg, 'DANGER');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Deactivate Toggle
  const handleToggleDeactivate = async (usr) => {
    let rId = 2;
    if (usr.role === 'VIEWER') rId = 3;

    const payload = {
      fullName: usr.fullName,
      email: usr.email,
      phone: usr.phone,
      roleId: rId,
      status: usr.status !== 'Active' // toggle
    };

    try {
      await api.put(`/api/users/${usr.userId}`, payload);
      triggerToast(`User status updated successfully.`, 'SUCCESS');
      fetchUsers();
    } catch (err) {
      triggerToast('Unable to toggle status.', 'DANGER');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, name) => {
    if (window.confirm(`Are you sure you want to delete user ${name}? This action is irreversible.`)) {
      try {
        await api.delete(`/api/users/${userId}`);
        triggerToast('User deleted successfully.', 'SUCCESS');
        fetchUsers();
      } catch (err) {
        triggerToast('Unable to delete user.', 'DANGER');
      }
    }
  };

  // Reset Password Action
  const handleResetPassword = async (usr) => {
    const newPass = 'Reset#' + Math.floor(1000 + Math.random() * 9000);
    let rId = 2;
    if (usr.role === 'VIEWER') rId = 3;

    const payload = {
      fullName: usr.fullName,
      email: usr.email,
      phone: usr.phone,
      password: newPass,
      roleId: rId,
      status: usr.status === 'Active'
    };

    try {
      await api.put(`/api/users/${usr.userId}`, payload);
      alert(`Password reset successful for ${usr.fullName}.\nNew Temporary Password: ${newPass}`);
      triggerToast(`Password reset successfully.`, 'SUCCESS');
      fetchUsers();
    } catch (err) {
      triggerToast('Unable to reset password.', 'DANGER');
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getRoleBadge = (role) => {
    if (role === 'ADMIN') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">Admin</span>;
    } else if (role === 'PHARMACIST') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Pharmacist</span>;
    } else {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Viewer / Staff</span>;
    }
  };

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-4"><div className="h-3.5 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-4"><div className="h-3.5 bg-gray-150 rounded w-3/4"></div></td>
      <td className="p-4"><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
      <td className="p-4"><div className="h-3 bg-gray-100 rounded w-1/4"></div></td>
      <td className="p-4"><div className="h-3 bg-gray-100 rounded w-1/3"></div></td>
      <td className="p-4"><div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
    </tr>
  );

  if (!currentSessionUser?.role?.includes('ADMIN')) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center font-sans space-y-2">
        <span className="text-5xl mb-2">🚫</span>
        <h3 className="text-sm font-bold text-gray-800">Access Restricted</h3>
        <p className="text-xs text-gray-450 leading-relaxed max-w-sm">Only system administrators are authorized to manage user credentials.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 text-white text-xs font-bold py-3 px-5 rounded-[10px] shadow-lg z-50 border ${
          toastType === 'DANGER' ? 'bg-red-700 border-red-600' :
          toastType === 'WARNING' ? 'bg-amber-600 border-amber-500' :
          'bg-teal-800 border-teal-600'
        }`}>
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Account Management Console</h1>
          <p className="text-xs text-gray-500">Monitor active user sessions, reset passwords, edit details, and add staff members.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            className="w-full bg-white border border-gray-300 p-2.5 pl-8 text-xs rounded-card focus:outline-none focus:border-teal-700"
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 uppercase">Role:</span>
            <select
              className="bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 w-full sm:w-auto"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Roles</option>
              <option value="PHARMACIST">Pharmacist Only</option>
              <option value="VIEWER">Viewer Only</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 uppercase">Status:</span>
            <select
              className="bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Professional Registry Table */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500">
                <th className="p-4 font-bold">Operator Name</th>
                <th className="p-4 font-bold">Email Address</th>
                <th className="p-4 font-bold">Phone No.</th>
                <th className="p-4 font-bold">Access Role</th>
                <th className="p-4 font-bold">Registry Status</th>
                <th className="p-4 font-bold">Last Activity</th>
                <th className="p-4 text-center font-bold">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((usr) => (
                  <tr key={usr.userId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{usr.fullName}</td>
                    <td className="p-4 text-gray-600 font-medium">{usr.email}</td>
                    <td className="p-4 text-gray-500 font-mono text-[11px]">{usr.phone}</td>
                    <td className="p-4">{getRoleBadge(usr.role)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center text-[10px] font-bold ${
                        usr.status === 'Active' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          usr.status === 'Active' ? 'bg-green-500' : 'bg-red-400'
                        }`}></span>
                        {usr.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-[11px]">{usr.lastLogin}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        {usr.role !== 'ADMIN' && (
                          <>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditClick(usr)}
                              className="p-1.5 text-gray-500 hover:text-teal-700 hover:bg-slate-100 rounded-md transition-colors"
                              title="Edit User Details"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>

                            {/* Reset Password Button */}
                            <button
                              onClick={() => handleResetPassword(usr)}
                              className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
                              title="Reset Security Password"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-5 4a5 5 0 0110 0v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </button>

                            {/* Deactivate/Activate Toggle Button */}
                            <button
                              onClick={() => handleToggleDeactivate(usr)}
                              className={`p-1.5 rounded-md transition-colors ${
                                usr.status === 'Active'
                                  ? 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                              }`}
                              title={usr.status === 'Active' ? 'Deactivate User Account' : 'Activate User Account'}
                            >
                              {usr.status === 'Active' ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(usr.userId, usr.fullName)}
                              className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Account Permanently"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-400 bg-slate-50/20">
                    <div className="flex flex-col justify-center items-center font-sans">
                      <span className="text-4xl mb-3">👥</span>
                      <h4 className="text-sm font-bold text-gray-700">No users found.</h4>
                      <p className="text-xs text-gray-400 mt-1 mb-4">You can register a new system operator manually.</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="py-1.5 px-3.5 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs cursor-pointer shadow-sm transition-colors"
                      >
                        + Create Operator
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="bg-slate-50 border-t border-gray-200 px-4 py-3.5 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-bold">{filteredUsers.length}</span> registry members
            </span>
            <div className="flex space-x-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-2.5 py-1 text-xs border border-gray-300 rounded-card font-medium text-gray-600 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
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
                className="px-2.5 py-1 text-xs border border-gray-300 rounded-card font-medium text-gray-600 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD USER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-[10px] border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Provision New Enterprise Account</h3>
              <button onClick={resetAddForm} className="text-gray-400 hover:text-gray-600 font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input
                  ref={addNameRef}
                  type="text"
                  required
                  disabled={submitLoading}
                  className={`w-full bg-white border rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                    addErrors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name (alphabets & spaces only)"
                  value={fullName}
                  onChange={(e) => handleAddChange('fullName', e.target.value)}
                />
                {addErrors.fullName && <p className="text-[10px] text-red-500 mt-1 font-semibold">{addErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">System Email</label>
                <input
                  ref={addEmailRef}
                  type="email"
                  required
                  disabled={submitLoading}
                  className={`w-full bg-white border rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                    addErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="e.g. staffname@medistock.com"
                  value={email}
                  onChange={(e) => handleAddChange('email', e.target.value)}
                />
                {addErrors.email && <p className="text-[10px] text-red-500 mt-1 font-semibold">{addErrors.email}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <input
                  ref={addPhoneRef}
                  type="text"
                  required
                  disabled={submitLoading}
                  maxLength="10"
                  className={`w-full bg-white border rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                    addErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => handleAddChange('phone', e.target.value)}
                />
                {addErrors.phone && <p className="text-[10px] text-red-500 mt-1 font-semibold">{addErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Database Access Role</label>
                <select
                  disabled={submitLoading}
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:border-teal-75"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value="2">Pharmacist (PHARMACIST)</option>
                  <option value="3">Viewer / Operator (VIEWER)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Status</label>
                <select
                  disabled={submitLoading}
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:border-teal-75"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Temporary Security Password</label>
                <div className="flex gap-2">
                  <input
                    ref={addPasswordRef}
                    type="text"
                    required
                    disabled={submitLoading}
                    className={`flex-1 bg-white border rounded-card p-2 text-xs text-gray-955 font-mono focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                      addErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                    }`}
                    placeholder="Enter or generate temporary password"
                    value={password}
                    onChange={(e) => handleAddChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    disabled={submitLoading}
                    onClick={handleGeneratePassword}
                    className="py-2 px-3 bg-slate-100 border border-gray-300 text-gray-705 text-xs font-bold rounded-card hover:bg-slate-200 cursor-pointer disabled:opacity-50"
                  >
                    Generate Password
                  </button>
                </div>
                {addErrors.password && <p className="text-[10px] text-red-500 mt-1 font-semibold leading-relaxed">{addErrors.password}</p>}
              </div>

              <div className="pt-3 border-t border-gray-150 flex justify-end space-x-2.5">
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={resetAddForm}
                  className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddFormInvalid() || submitLoading}
                  className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {submitLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-[10px] border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Update User Account Registry</h3>
              <button onClick={() => { setShowEditModal(false); setEditingUser(null); }} className="text-gray-400 hover:text-gray-600 font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input
                  ref={editNameRef}
                  type="text"
                  required
                  disabled={submitLoading}
                  className={`w-full bg-white border rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                    editErrors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                  value={editingUser.fullName}
                  onChange={(e) => handleEditChange('fullName', e.target.value)}
                />
                {editErrors.fullName && <p className="text-[10px] text-red-500 mt-1 font-semibold">{editErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">System Email</label>
                <input
                  ref={editEmailRef}
                  type="email"
                  required
                  disabled={submitLoading}
                  className={`w-full bg-white border rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                    editErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="e.g. staffname@medistock.com"
                  value={editingUser.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                />
                {editErrors.email && <p className="text-[10px] text-red-500 mt-1 font-semibold">{editErrors.email}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <input
                  ref={editPhoneRef}
                  type="text"
                  required
                  disabled={submitLoading}
                  maxLength="10"
                  className={`w-full bg-white border rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                    editErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                  value={editingUser.phone}
                  onChange={(e) => handleEditChange('phone', e.target.value)}
                />
                {editErrors.phone && <p className="text-[10px] text-red-500 mt-1 font-semibold">{editErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Database Access Role</label>
                <select
                  disabled={submitLoading}
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:border-teal-75"
                  value={editingUser.roleId}
                  onChange={(e) => setEditingUser({ ...editingUser, roleId: parseInt(e.target.value, 10) })}
                >
                  <option value="2">Pharmacist (PHARMACIST)</option>
                  <option value="3">Viewer / Operator (VIEWER)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Status</label>
                <select
                  disabled={submitLoading}
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:border-teal-75"
                  value={editingUser.status ? 'Active' : 'Inactive'}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value === 'Active' })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">New Password (leave blank to keep current)</label>
                <input
                  ref={editPasswordRef}
                  type="password"
                  disabled={submitLoading}
                  className={`w-full bg-white border rounded-card p-2.5 text-xs text-gray-950 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-75 transition-all ${
                    editErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="Enter new complex password"
                  value={editingUser.password}
                  onChange={(e) => handleEditChange('password', e.target.value)}
                />
                {editErrors.password && <p className="text-[10px] text-red-500 mt-1 font-semibold leading-relaxed">{editErrors.password}</p>}
              </div>

              <div className="pt-3 border-t border-gray-150 flex justify-end space-x-2.5">
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => { setShowEditModal(false); setEditingUser(null); }}
                  className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditFormInvalid() || submitLoading}
                  className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {submitLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
