import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';

export default function AddEditMedicine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { triggerToast } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingSupps, setLoadingSupps] = useState(true);

  // Lists
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Form Fields
  const [medicineName, setMedicineName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [gst, setGst] = useState('18');
  const [quantity, setQuantity] = useState('0');
  const [minimumStock, setMinimumStock] = useState('10');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('Tablets');

  // Validation
  const [formErrors, setFormErrors] = useState({});

  // Input refs for focus
  const nameRef = useRef(null);
  const dosageRef = useRef(null);
  const batchRef = useRef(null);
  const mfgDateRef = useRef(null);
  const expDateRef = useRef(null);
  const purchaseRef = useRef(null);
  const sellingRef = useRef(null);
  const qtyRef = useRef(null);
  const minStockRef = useRef(null);

  const fetchDependenciesAndMedicine = async () => {
    setLoading(true);
    setLoadingCats(true);
    setLoadingSupps(true);
    try {
      // 1. Fetch categories
      api.get('/api/categories')
        .then(res => {
          if (res.data && Array.isArray(res.data.data)) {
            setCategories(res.data.data);
            if (!isEditMode && res.data.data.length > 0) {
              setCategoryId(res.data.data[0].categoryId.toString());
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingCats(false));

      // 2. Fetch suppliers
      api.get('/api/suppliers')
        .then(res => {
          if (res.data && Array.isArray(res.data.data)) {
            setSuppliers(res.data.data);
            if (!isEditMode && res.data.data.length > 0) {
              setSupplierId(res.data.data[0].supplierId.toString());
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingSupps(false));

      if (isEditMode) {
        const medRes = await api.get(`/api/medicines/${id}`);
        if (medRes.data && medRes.data.success) {
          const med = medRes.data.data;
          setMedicineName(med.medicineName || '');
          setGenericName(med.genericName || '');
          setCategoryId(med.categoryId?.toString() || '');
          setSupplierId(med.supplierId?.toString() || '');
          setBatchNumber(med.batchNumber || '');
          setManufacturer(med.manufacturer || '');
          setManufactureDate(med.manufactureDate || '');
          setExpiryDate(med.expiryDate || '');
          setPurchasePrice(med.purchasePrice?.toString() || '');
          setSellingPrice(med.sellingPrice?.toString() || '');
          setGst(med.gst?.toString() || '18');
          setQuantity(med.quantity?.toString() || '0');
          setMinimumStock(med.minimumStock?.toString() || '10');
          setBarcode(med.barcode || '');
          setImageUrl(med.imageUrl || '');
          setDescription(med.description || '');
          setDosage(med.dosage || '');
          setUnit(med.unit || 'Tablets');
        }
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to load details from the server.', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependenciesAndMedicine();
  }, [id]);

  const validateForm = () => {
    let errors = {};

    if (!medicineName.trim()) errors.medicineName = 'Medicine Name is required.';
    if (!dosage.trim()) errors.dosage = 'Dosage is required.';
    if (!batchNumber.trim()) errors.batchNumber = 'Batch Number is required.';
    if (!manufactureDate) errors.manufactureDate = 'Manufacturing Date is required.';
    if (!expiryDate) errors.expiryDate = 'Expiry Date is required.';
    if (!purchasePrice) errors.purchasePrice = 'Purchase Price is required.';
    if (!sellingPrice) errors.sellingPrice = 'Selling Price is required.';
    if (quantity === '') errors.quantity = 'Quantity is required.';
    if (minimumStock === '') errors.minimumStock = 'Minimum Stock is required.';
    if (!categoryId) errors.categoryId = 'Category is required.';
    if (!supplierId) errors.supplierId = 'Supplier is required.';

    if (manufactureDate && expiryDate) {
      const mfg = new Date(manufactureDate);
      const exp = new Date(expiryDate);
      if (exp <= mfg) {
        errors.expiryDate = 'Expiry Date must be after Manufacturing Date.';
      }
    }

    if (purchasePrice && sellingPrice) {
      const p = parseFloat(purchasePrice);
      const s = parseFloat(sellingPrice);
      if (s <= p) {
        errors.sellingPrice = 'Selling Price must be greater than Purchase Price.';
      }
    }

    if (parseInt(quantity, 10) < 0) {
      errors.quantity = 'Quantity cannot be negative.';
    }

    if (parseInt(minimumStock, 10) < 0) {
      errors.minimumStock = 'Minimum buffer stock cannot be negative.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.medicineName) nameRef.current?.focus();
      else if (errors.dosage) dosageRef.current?.focus();
      else if (errors.batchNumber) batchRef.current?.focus();
      else if (errors.manufactureDate) mfgDateRef.current?.focus();
      else if (errors.expiryDate) expDateRef.current?.focus();
      else if (errors.purchasePrice) purchaseRef.current?.focus();
      else if (errors.sellingPrice) sellingRef.current?.focus();
      else if (errors.quantity) qtyRef.current?.focus();
      else if (errors.minimumStock) minStockRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const payload = {
      medicineName: medicineName.trim(),
      genericName: genericName.trim(),
      categoryId: parseInt(categoryId, 10),
      supplierId: parseInt(supplierId, 10),
      batchNumber: batchNumber.trim(),
      manufacturer: manufacturer.trim(),
      manufactureDate,
      expiryDate,
      purchasePrice: parseFloat(purchasePrice),
      sellingPrice: parseFloat(sellingPrice),
      gst: parseFloat(gst || 0),
      quantity: parseInt(quantity, 10),
      minimumStock: parseInt(minimumStock, 10),
      barcode: barcode.trim(),
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      dosage: dosage.trim(),
      unit
    };

    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/api/medicines/${id}`, payload);
      } else {
        res = await api.post('/api/medicines', payload);
      }

      if (res.data && res.data.success) {
        triggerToast(
          isEditMode ? 'Medicine updated successfully.' : 'Medicine created successfully.',
          'SUCCESS'
        );
        navigate('/medicines');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Transaction rejected by server.';
      handleBackendErrors(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBackendErrors = (msg) => {
    const errors = {};
    if (msg.toLowerCase().includes('medicine name already exists') || msg.toLowerCase().includes('medicine name')) {
      errors.medicineName = 'Medicine name already exists in the catalog.';
      medNameRef.current?.focus();
    } else if (msg.includes('Batch') || msg.toLowerCase().includes('batch')) {
      errors.batchNumber = 'Batch Number already exists.';
      batchRef.current?.focus();
    } else if (msg.toLowerCase().includes('expiry') || msg.toLowerCase().includes('date')) {
      errors.expiryDate = 'Expiry Date must be after Manufacturing Date.';
      expDateRef.current?.focus();
    } else if (msg.toLowerCase().includes('selling') || msg.toLowerCase().includes('price')) {
      errors.sellingPrice = 'Selling Price must be greater than Purchase Price.';
      sellingRef.current?.focus();
    } else if (msg.toLowerCase().includes('quantity')) {
      errors.quantity = 'Quantity cannot be negative.';
      qtyRef.current?.focus();
    } else if (msg.toLowerCase().includes('category')) {
      errors.categoryId = 'Category not found or is required.';
    } else if (msg.toLowerCase().includes('supplier')) {
      errors.supplierId = 'Supplier not found or is required.';
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

  const selectedSupplierObj = suppliers.find(s => s.supplierId.toString() === supplierId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-10">
      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Modify Catalog Entry' : 'Register New Medicine'}
          </h1>
          <p className="text-xs text-gray-500">Provide medication formulas, batch parameters, valuations, and quantities.</p>
        </div>
        <Link
          to="/medicines"
          className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer transition-colors"
        >
          &larr; Back to List
        </Link>
      </div>

      {/* Dependency Warning Banners */}
      {suppliers.length === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-850 p-4 rounded-[10px] space-y-2 flex flex-col items-start">
          <div className="flex items-center space-x-2 font-bold">
            <svg className="w-5 h-5 text-red-650 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No suppliers found.</span>
          </div>
          <p className="text-[11px] font-medium leading-normal">Please create a supplier before adding medicines.</p>
          <button
            type="button"
            onClick={() => navigate('/suppliers/new')}
            className="py-1.5 px-3 bg-red-650 hover:bg-red-750 text-white font-bold rounded-card text-[10px] cursor-pointer transition-colors"
          >
            Go to Suppliers
          </button>
        </div>
      )}

      {categories.length === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-850 p-4 rounded-[10px] space-y-2 flex flex-col items-start">
          <div className="flex items-center space-x-2 font-bold">
            <svg className="w-5 h-5 text-red-650 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No categories found.</span>
          </div>
          <p className="text-[11px] font-medium leading-normal">Please create a category first.</p>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="py-1.5 px-3 bg-red-650 hover:bg-red-750 text-white font-bold rounded-card text-[10px] cursor-pointer transition-colors"
          >
            Go to Categories
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-[10px] p-6 shadow-sm space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-850 uppercase tracking-wider border-b border-slate-100 pb-1">
            1. Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Medicine Name *</label>
              <input
                ref={nameRef}
                type="text"
                required
                className={`w-full bg-white border rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                  formErrors.medicineName ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                }`}
                placeholder="e.g. Paracetamol 650mg"
                value={medicineName}
                onChange={(e) => {
                  setMedicineName(e.target.value);
                  setFormErrors(prev => ({ ...prev, medicineName: null }));
                }}
              />
              {formErrors.medicineName && (
                <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.medicineName}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Generic Name</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                placeholder="e.g. Acetaminophen"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category *</label>
              {loadingCats ? (
                <div className="text-xs text-gray-400 font-semibold py-2">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="space-y-1.5">
                  <div className="text-xs text-red-500 font-semibold font-sans">No categories available</div>
                  <Link to="/categories" className="inline-block py-1.5 px-3 bg-red-600 hover:bg-red-750 text-white font-bold rounded-card text-[10px]">
                    Go to Categories
                  </Link>
                </div>
              ) : (
                <select
                  className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              )}
              {formErrors.categoryId && (
                <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Supplier *</label>
              {loadingSupps ? (
                <div className="text-xs text-gray-400 font-semibold py-2">Loading suppliers...</div>
              ) : suppliers.length === 0 ? (
                <div className="space-y-1.5">
                  <div className="text-xs text-red-500 font-semibold font-sans">No suppliers available</div>
                  <Link to="/suppliers/new" className="inline-block py-1.5 px-3 bg-red-600 hover:bg-red-750 text-white font-bold rounded-card text-[10px]">
                    Go to Suppliers
                  </Link>
                </div>
              ) : (
                <select
                  className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>
                  ))}
                </select>
              )}
              {formErrors.supplierId && (
                <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.supplierId}</p>
              )}
              {selectedSupplierObj && (
                <div className="text-[9px] bg-slate-50 border border-slate-200 p-1.5 rounded-[6px] mt-1.5 text-gray-500 leading-normal font-sans">
                  <span className="font-bold text-gray-700">Contact:</span> {selectedSupplierObj.contactPerson || 'N/A'}
                  {selectedSupplierObj.phone && <span className="block mt-0.5"><span className="font-bold text-gray-700">Phone:</span> {selectedSupplierObj.phone}</span>}
                  {selectedSupplierObj.email && <span className="block mt-0.5"><span className="font-bold text-gray-700">Email:</span> {selectedSupplierObj.email}</span>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Dosage *</label>
              <input
                ref={dosageRef}
                type="text"
                required
                className={`w-full bg-white border rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                  formErrors.dosage ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                }`}
                placeholder="e.g. 500mg, 5ml"
                value={dosage}
                onChange={(e) => {
                  setDosage(e.target.value);
                  setFormErrors(prev => ({ ...prev, dosage: null }));
                }}
              />
              {formErrors.dosage && (
                <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.dosage}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Packaging Unit *</label>
              <select
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="Tablets">Tablets</option>
                <option value="Capsules">Capsules</option>
                <option value="Vial">Vial / Injection</option>
                <option value="Syrup">Syrup Bottle</option>
                <option value="Ointment">Ointment Tube</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Batch Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-850 uppercase tracking-wider border-b border-slate-100 pb-1">
            2. Batch Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Batch Number *</label>
              <input
                ref={batchRef}
                type="text"
                required
                className={`w-full bg-white border rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                  formErrors.batchNumber ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                }`}
                placeholder="e.g. BATCH-12345"
                value={batchNumber}
                onChange={(e) => {
                  setBatchNumber(e.target.value);
                  setFormErrors(prev => ({ ...prev, batchNumber: null }));
                }}
              />
              {formErrors.batchNumber && (
                <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.batchNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Barcode / Serial</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                placeholder="EAN/UPC barcode number"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Manufacturing Date *</label>
              <input
                ref={mfgDateRef}
                type="date"
                required
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Expiry Date *</label>
              <input
                ref={expDateRef}
                type="date"
                required
                className={`w-full bg-white border rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                  formErrors.expiryDate ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                }`}
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  setFormErrors(prev => ({ ...prev, expiryDate: null }));
                }}
              />
              {formErrors.expiryDate && (
                <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.expiryDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Pricing */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-850 uppercase tracking-wider border-b border-slate-100 pb-1">
            3. Pricing Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Purchase Price (₹) *</label>
              <input
                ref={purchaseRef}
                type="number"
                required
                step="0.01"
                min="0"
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                placeholder="0.00"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Selling Price (₹) *</label>
              <input
                ref={sellingRef}
                type="number"
                required
                step="0.01"
                min="0"
                className={`w-full bg-white border rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                  formErrors.sellingPrice ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                }`}
                placeholder="0.00"
                value={sellingPrice}
                onChange={(e) => {
                  setSellingPrice(e.target.value);
                  setFormErrors(prev => ({ ...prev, sellingPrice: null }));
                }}
              />
              {formErrors.sellingPrice && (
                <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.sellingPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">GST (%)</label>
              <select
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
              >
                <option value="0">0% Exempt</option>
                <option value="5">5% SGST/CGST</option>
                <option value="12">12% Standard</option>
                <option value="18">18% Standard Tier</option>
                <option value="28">28% Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Inventory */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-850 uppercase tracking-wider border-b border-slate-100 pb-1">
            4. Inventory Stock Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Initial Stock Quantity *</label>
              <input
                ref={qtyRef}
                type="number"
                required
                disabled={isEditMode}
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none disabled:bg-slate-50 disabled:text-gray-400"
                placeholder="Units on shelf"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {isEditMode && <p className="text-[9px] text-gray-400 mt-1">Stock quantity updates are audited via stock adjustment transactions.</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Minimum Buffer Stock *</label>
              <input
                ref={minStockRef}
                type="number"
                required
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none"
                placeholder="Trigger warning threshold"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Additional Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-teal-850 uppercase tracking-wider border-b border-slate-100 pb-1">
            5. Additional Information
          </h3>
          <div className="grid grid-cols-1 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Manufacturer</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none"
                placeholder="Manufacturer company name"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Medicine Image URL</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Storage & Dispensing description</label>
              <textarea
                className="w-full bg-white border border-gray-300 rounded-[10px] p-2.5 text-xs focus:outline-none"
                rows="2"
                placeholder="Indicate storage directions (e.g. Keep in cool dark cabinet below 25°C)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <Link
            to="/medicines"
            className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitLoading || suppliers.length === 0 || categories.length === 0}
            className="py-2 px-5 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {isEditMode ? 'Save Changes' : 'Register Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
}
