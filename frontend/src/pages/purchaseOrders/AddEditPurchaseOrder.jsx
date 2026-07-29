import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';

export default function AddEditPurchaseOrder() {
  const navigate = useNavigate();
  const { triggerToast } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // States
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);

  // Form Fields
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [orderItems, setOrderItems] = useState([
    { medicineId: '', quantity: '10', unitPrice: '' }
  ]);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [suppsRes, medsRes] = await Promise.all([
        api.get('/api/suppliers').catch(() => null),
        api.get('/api/medicines').catch(() => null)
      ]);

      let loadedSupps = [];
      let loadedMeds = [];

      if (suppsRes && suppsRes.data && Array.isArray(suppsRes.data.data)) {
        loadedSupps = suppsRes.data.data;
        setSuppliers(loadedSupps);
        if (loadedSupps.length > 0) {
          setSelectedSupplierId(loadedSupps[0].supplierId.toString());
        }
      }

      if (medsRes && medsRes.data && Array.isArray(medsRes.data.data)) {
        loadedMeds = medsRes.data.data;
        setMedicines(loadedMeds);
        
        // Pre-fill first item row
        if (loadedMeds.length > 0) {
          setOrderItems([
            { 
              medicineId: loadedMeds[0].medicineId.toString(), 
              quantity: '10', 
              unitPrice: loadedMeds[0].purchasePrice?.toString() || '10.00' 
            }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to fetch purchase catalog requirements.', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const handleAddItemRow = () => {
    const defaultMed = medicines[0];
    setOrderItems([
      ...orderItems,
      { 
        medicineId: defaultMed ? defaultMed.medicineId.toString() : '', 
        quantity: '10', 
        unitPrice: defaultMed ? defaultMed.purchasePrice?.toString() || '10.00' : '' 
      }
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const items = [...orderItems];
    items[index][field] = value;
    if (field === 'medicineId') {
      const match = medicines.find(m => m.medicineId.toString() === value);
      if (match) {
        items[index].unitPrice = match.purchasePrice?.toString() || '';
      }
    }
    setOrderItems(items);
  };

  const handleRemoveItemRow = (index) => {
    if (orderItems.length === 1) return;
    const items = orderItems.filter((_, idx) => idx !== index);
    setOrderItems(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      triggerToast('Please select a supplier.', 'WARNING');
      return;
    }

    setSubmitLoading(true);
    const itemsPayload = orderItems.map(item => ({
      medicineId: parseInt(item.medicineId, 10),
      quantity: parseInt(item.quantity, 10),
      unitPrice: parseFloat(item.unitPrice || 0)
    }));

    const payload = {
      supplierId: parseInt(selectedSupplierId, 10),
      items: itemsPayload
    };

    try {
      const res = await api.post('/api/purchase-orders', payload);
      if (res.data && res.data.success) {
        triggerToast('Purchase order submitted successfully.', 'SUCCESS');
        navigate('/purchase-orders');
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Failed to submit purchase order.', 'DANGER');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Calc subtotal dynamically
  const subtotalVal = orderItems.reduce((acc, curr) => {
    const qty = parseInt(curr.quantity || 0, 10);
    const price = parseFloat(curr.unitPrice || 0);
    return acc + (qty * price);
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-4 border-teal-650 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-10">
      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Draft New Purchase Order</h1>
          <p className="text-xs text-gray-500">Draft procurement contracts and set wholesale price sheets.</p>
        </div>
        <Link
          to="/purchase-orders"
          className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer transition-colors"
        >
          &larr; Back to Orders
        </Link>
      </div>

      {/* Dependency Check */}
      {suppliers.length === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-850 p-4 rounded-[10px] space-y-2 flex flex-col items-start">
          <div className="flex items-center space-x-2 font-bold">
            <svg className="w-5 h-5 text-red-650 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No active suppliers registered.</span>
          </div>
          <p className="text-[11px] font-medium leading-normal">You must register at least one wholesale supplier profile before initiating purchase contracts.</p>
          <button
            type="button"
            onClick={() => navigate('/suppliers/new')}
            className="py-1.5 px-3 bg-red-650 hover:bg-red-750 text-white font-bold rounded-card text-[10px] cursor-pointer transition-colors"
          >
            Create Supplier Profile
          </button>
        </div>
      )}

      {medicines.length === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-850 p-4 rounded-[10px] space-y-2 flex flex-col items-start">
          <div className="flex items-center space-x-2 font-bold">
            <svg className="w-5 h-5 text-red-650 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No catalog medicines exist.</span>
          </div>
          <p className="text-[11px] font-medium leading-normal">Please add a medicine to the catalog registry first.</p>
          <button
            type="button"
            onClick={() => navigate('/medicines/new')}
            className="py-1.5 px-3 bg-red-650 hover:bg-red-750 text-white font-bold rounded-card text-[10px] cursor-pointer transition-colors"
          >
            Add Medicine Entry
          </button>
        </div>
      )}

      {/* Purchase Order Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-[10px] p-6 shadow-sm space-y-6 text-xs">
        {/* Select Supplier */}
        <div className="w-full max-w-md">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Supplier *</label>
          <select
            required
            className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 font-semibold text-gray-700"
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
          >
            {suppliers.map((s) => (
              <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>
            ))}
          </select>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-[11px] font-bold text-teal-850 uppercase tracking-wider">Purchase Order Line Items</h4>
            <button
              type="button"
              disabled={medicines.length === 0}
              onClick={handleAddItemRow}
              className="py-1.5 px-3 border border-[#0F766E] text-[#0F766E] font-bold rounded-card text-[10px] hover:bg-teal-50 cursor-pointer disabled:opacity-40"
            >
              + Add Row Item
            </button>
          </div>

          <div className="border border-gray-200 rounded-[10px] overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-3">Medicine Product *</th>
                  <th className="p-3 w-28 text-center">Quantity *</th>
                  <th className="p-3 w-36 text-right">Unit Cost (₹) *</th>
                  <th className="p-3 text-right w-32">Total Value</th>
                  <th className="p-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {orderItems.map((item, idx) => {
                  const qty = parseInt(item.quantity || 0, 10);
                  const price = parseFloat(item.unitPrice || 0);
                  const lineVal = qty * price;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 font-sans">
                      <td className="p-2">
                        <select
                          className="w-full bg-white border border-gray-300 rounded-card p-1.5 text-xs focus:outline-none"
                          value={item.medicineId}
                          onChange={(e) => handleItemChange(idx, 'medicineId', e.target.value)}
                        >
                          {medicines.map((m) => (
                            <option key={m.medicineId} value={m.medicineId}>
                              {m.medicineName} ({m.batchNumber})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          required
                          min="1"
                          className="w-full bg-white border border-gray-300 rounded-card p-1.5 text-xs text-center"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          required
                          step="0.01"
                          className="w-full bg-white border border-gray-300 rounded-card p-1.5 text-xs text-right"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-gray-800">
                        ₹{lineVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-gray-400 hover:text-red-600 cursor-pointer font-bold"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estimated Subtotal */}
        <div className="bg-slate-50 border border-gray-200 p-4 rounded-[10px] flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estimated PO Subtotal Amount</span>
          <span className="text-sm font-bold text-[#0F766E] font-mono">
            ₹{subtotalVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Actions panel */}
        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <Link
            to="/purchase-orders"
            className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-707 text-xs font-bold rounded-card cursor-pointer transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitLoading || suppliers.length === 0 || medicines.length === 0}
            className="py-2 px-5 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            Submit Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
}
