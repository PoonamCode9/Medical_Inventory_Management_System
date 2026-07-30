import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiPlus, FiTrash2, FiFileText, FiCheckCircle } from 'react-icons/fi';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active transaction state
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState({
    medicineId: '',
    batchNumber: '',
    quantity: 10,
    unitCostPrice: '',
    expiryDate: ''
  });

  const fetchLedgers = async () => {
    try {
      const [pRes, sRes, mRes] = await Promise.all([
        API.get('/api/purchases'),
        API.get('/api/suppliers'),
        API.get('/api/medicines')
      ]);
      setPurchases(pRes.data);
      setSuppliers(sRes.data);
      setMedicines(mRes.data);
      if (sRes.data.length > 0) setSelectedSupplierId(sRes.data[0].id);
      if (mRes.data.length > 0) {
        setItemForm(prev => ({
          ...prev,
          medicineId: mRes.data[0].id,
          unitCostPrice: mRes.data[0].costPrice || ''
        }));
      }
    } catch (err) {
      setError('Failed to fetch transaction data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const handleMedChange = (e) => {
    const medId = e.target.value;
    const med = medicines.find(m => m.id.toString() === medId.toString());
    setItemForm(prev => ({
      ...prev,
      medicineId: medId,
      unitCostPrice: med ? med.costPrice : ''
    }));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!itemForm.medicineId || !itemForm.batchNumber || !itemForm.quantity || !itemForm.unitCostPrice || !itemForm.expiryDate) {
      setError('Please fill in all line item fields');
      return;
    }

    const med = medicines.find(m => m.id.toString() === itemForm.medicineId.toString());
    
    // Check if batch is already added in current draft
    const duplicate = items.find(it => it.medicineId === itemForm.medicineId && it.batchNumber === itemForm.batchNumber);
    if (duplicate) {
      setError('This batch is already added in the item list. Edit it or delete it.');
      return;
    }

    const newItem = {
      medicineId: parseInt(itemForm.medicineId),
      medicineName: med ? med.name : 'Unknown',
      batchNumber: itemForm.batchNumber,
      quantity: parseInt(itemForm.quantity),
      unitCostPrice: parseFloat(itemForm.unitCostPrice),
      expiryDate: itemForm.expiryDate
    };

    setItems(prev => [...prev, newItem]);
    setError('');
    
    // Reset form fields except medicine selection
    setItemForm(prev => ({
      ...prev,
      batchNumber: '',
      quantity: 10,
      expiryDate: ''
    }));
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const submitOrder = async () => {
    if (items.length === 0) {
      setError('Cannot submit empty purchase order. Add items first.');
      return;
    }

    try {
      const payload = {
        supplierId: parseInt(selectedSupplierId),
        status: 'RECEIVED',
        items: items
      };
      
      await API.post('/api/purchases', payload);
      setSuccess('Stock replenishment purchase order logged and inventory updated.');
      setItems([]);
      fetchLedgers();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit purchase order');
    }
  };

  return (
    <div className="space-y-8 font-sans text-xs">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Stock In (Purchases)</h1>
        <p className="text-xs text-slate-400 mt-1">Receive new batches of medicines from registered suppliers and adjust stock levels.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center">
          <FiCheckCircle size={18} className="mr-2" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
          {error}
        </div>
      )}

      {/* Grid: Order Builder & History Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Order Builder Form (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h2 className="font-bold text-sm text-slate-200">1. Draft Purchase Receipt</h2>
            
            <div className="w-1/2">
              <label className="block font-semibold text-slate-400 mb-1.5">Supplier Partner *</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Line Item Adder */}
            <form onSubmit={addItem} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-semibold text-slate-400 mb-1">Medicine *</label>
                <select
                  value={itemForm.medicineId}
                  onChange={handleMedChange}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Batch # *</label>
                <input
                  type="text"
                  required
                  placeholder="B-XX123"
                  value={itemForm.batchNumber}
                  onChange={(e) => setItemForm({...itemForm, batchNumber: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({...itemForm, quantity: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Unit Cost (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={itemForm.unitCostPrice}
                  onChange={(e) => setItemForm({...itemForm, unitCostPrice: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={itemForm.expiryDate}
                  onChange={(e) => setItemForm({...itemForm, expiryDate: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="col-span-2 sm:col-span-5 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-1 px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-650 text-slate-200 rounded-xl font-bold transition-all"
                >
                  <FiPlus size={14} />
                  <span>Add Line Item</span>
                </button>
              </div>
            </form>

            {/* List of Draft Items */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-300">Items List</h3>
              {items.length === 0 ? (
                <div className="py-8 text-center text-slate-500 bg-slate-950/20 rounded-2xl border border-dashed border-slate-850">
                  No items added to draft list.
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
                        <th className="px-4 py-3">Medicine</th>
                        <th className="px-4 py-3">Batch Number</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Cost Price</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                        <th className="px-4 py-3 text-center">Expiry</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/60 text-slate-300">
                      {items.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-850/10">
                          <td className="px-4 py-3 font-semibold text-slate-200">{item.medicineName}</td>
                          <td className="px-4 py-3 font-mono">{item.batchNumber}</td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">₹{item.unitCostPrice}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-200">
                            ₹{(item.unitCostPrice * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-400">{item.expiryDate}</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300">
                              <FiTrash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Total summary & Submission */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center bg-slate-900">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Estimate</div>
                  <div className="text-lg font-black text-slate-100">
                    ₹{items.reduce((sum, item) => sum + (item.unitCostPrice * item.quantity * 1.12), 0).toFixed(2)}
                    <span className="text-[10px] text-slate-500 font-normal ml-1">(inc. 12% GST)</span>
                  </div>
                </div>
                <button
                  onClick={submitOrder}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl shadow-lg shadow-teal-600/20 transition-all"
                >
                  Log Purchase & Issue Stock
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Ledger history list (1/3 width) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[550px]">
          <h2 className="font-bold text-sm text-slate-200 mb-4 flex items-center">
            <FiFileText className="text-teal-400 mr-2" /> Purchase Log History
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-slate-500 text-center py-12">No purchases registered yet.</div>
            ) : (
              purchases.map((p) => (
                <div key={p.id} className="p-3.5 bg-slate-850/30 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-200">
                    <span>Order #{p.id}</span>
                    <span className="text-teal-400">₹{p.totalAmount}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <p>Supplier: {p.supplierName}</p>
                    <p>GST Paid: ₹{p.gstAmount}</p>
                    <p>Date: {new Date(p.purchaseDate).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
