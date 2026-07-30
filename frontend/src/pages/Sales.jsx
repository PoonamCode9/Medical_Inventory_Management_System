import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiTrash2, FiFileText, FiPrinter, FiX, FiCheckCircle } from 'react-icons/fi';

const Sales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active billing states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [items, setItems] = useState([]);
  
  // Line item states
  const [selectedMedId, setSelectedMedId] = useState('');
  const [selectedBatchNumber, setSelectedBatchNumber] = useState('');
  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [maxAvailable, setMaxAvailable] = useState(0);

  // Invoice print modal
  const [showReceipt, setShowReceipt] = useState(null);

  const fetchSalesData = async () => {
    try {
      const [sRes, mRes] = await Promise.all([
        API.get('/api/sales'),
        API.get('/api/medicines')
      ]);
      setSales(sRes.data);
      setMedicines(mRes.data);
      if (mRes.data.length > 0) {
        setSelectedMedId(mRes.data[0].id);
        fetchMedBatches(mRes.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch sales log details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedBatches = async (medId) => {
    setLoadingBatches(true);
    try {
      const res = await API.get(`/api/inventory/medicine/${medId}`);
      // Filter out empty batches
      const activeBatches = res.data.filter(b => b.quantity > 0);
      setBatches(activeBatches);
      
      const selectedMed = medicines.find(m => m.id.toString() === medId.toString());
      setUnitPrice(selectedMed ? selectedMed.sellingPrice : '');

      if (activeBatches.length > 0) {
        setSelectedBatchNumber(activeBatches[0].batchNumber);
        setMaxAvailable(activeBatches[0].quantity);
      } else {
        setSelectedBatchNumber('');
        setMaxAvailable(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleMedChange = (e) => {
    const medId = e.target.value;
    setSelectedMedId(medId);
    fetchMedBatches(medId);
  };

  const handleBatchChange = (e) => {
    const batchNo = e.target.value;
    setSelectedBatchNumber(batchNo);
    const batch = batches.find(b => b.batchNumber === batchNo);
    setMaxAvailable(batch ? batch.quantity : 0);
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!selectedMedId || !selectedBatchNumber || qty <= 0 || !unitPrice) {
      setError('Please select medicine, batch number, price, and valid quantity.');
      return;
    }
    if (qty > maxAvailable) {
      setError(`Cannot issue ${qty} units. Selected batch only has ${maxAvailable} units available.`);
      return;
    }

    const med = medicines.find(m => m.id.toString() === selectedMedId.toString());
    const duplicate = items.find(it => it.medicineId === selectedMedId && it.batchNumber === selectedBatchNumber);
    if (duplicate) {
      setError('This batch is already added in the bill. Adjust its quantity.');
      return;
    }

    const newItem = {
      medicineId: parseInt(selectedMedId),
      medicineName: med ? med.name : 'Unknown',
      batchNumber: selectedBatchNumber,
      quantity: parseInt(qty),
      unitPrice: parseFloat(unitPrice)
    };

    setItems(prev => [...prev, newItem]);
    setError('');
    
    // Refresh batches after adding to list (in case they add more from same batch later)
    setMaxAvailable(prev => prev - qty);
    setQty(1);
  };

  const removeItem = (index) => {
    const removedItem = items[index];
    setItems(prev => prev.filter((_, i) => i !== index));
    // Restore availability cache
    if (removedItem.medicineId.toString() === selectedMedId.toString() && removedItem.batchNumber === selectedBatchNumber) {
      setMaxAvailable(prev => prev + removedItem.quantity);
    }
  };

  const submitInvoice = async () => {
    if (items.length === 0) {
      setError('Add medicine items to draft bill first.');
      return;
    }

    try {
      const payload = {
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || 'N/A',
        paymentMode: paymentMode,
        items: items
      };

      const res = await API.post('/api/sales', payload);
      setSuccess('Invoice created successfully!');
      
      // Load receipt data
      setShowReceipt(res.data);
      
      // Reset forms
      setItems([]);
      setCustomerName('');
      setCustomerPhone('');
      fetchSalesData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invoice submission failed');
    }
  };

  return (
    <div className="space-y-8 font-sans text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Billing & Sales (Stock Out)</h1>
          <p className="text-xs text-slate-400 mt-1">Issue retail bills, deduct batch quantities, calculate Indian GST, and print invoices.</p>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Bill Builder (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h2 className="font-bold text-sm text-slate-200">New Sales Bill</h2>
            
            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-400 mb-1.5">Customer Name</label>
                <input
                  type="text"
                  placeholder="Yash Raj"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 mb-1.5">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI (GPay/PhonePe)</option>
                  <option value="CARD">Debit/Credit Card</option>
                </select>
              </div>
            </div>

            {/* Line Item Adder */}
            <form onSubmit={addItem} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-semibold text-slate-400 mb-1">Select Medicine *</label>
                <select
                  value={selectedMedId}
                  onChange={handleMedChange}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Select Batch *</label>
                {loadingBatches ? (
                  <div className="h-8 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-850">
                    <span className="animate-pulse text-[10px] text-slate-500">Loading...</span>
                  </div>
                ) : batches.length === 0 ? (
                  <div className="h-8 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-850 text-[10px] text-red-400 font-bold text-center px-1">
                    OUT OF STOCK
                  </div>
                ) : (
                  <select
                    value={selectedBatchNumber}
                    onChange={handleBatchChange}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none font-mono"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.batchNumber}>{b.batchNumber} (Avail: {b.quantity})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={maxAvailable}
                  value={qty}
                  disabled={maxAvailable === 0}
                  onChange={(e) => setQty(Math.min(parseInt(e.target.value) || 1, maxAvailable))}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none disabled:bg-slate-900 disabled:text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Unit Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <button
                  type="submit"
                  disabled={maxAvailable === 0}
                  className="w-full flex items-center justify-center space-x-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-850 text-white disabled:text-slate-600 rounded-xl font-bold transition-all"
                >
                  <FiPlus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </form>

            {/* Invoiced items list */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-300">Invoice Items</h3>
              {items.length === 0 ? (
                <div className="py-8 text-center text-slate-500 bg-slate-950/20 rounded-2xl border border-dashed border-slate-850">
                  No items added to billing receipt.
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
                        <th className="px-4 py-3">Medicine Name</th>
                        <th className="px-4 py-3">Batch Number</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                        <th className="px-4 py-3 text-center">Tax Split (12% GST)</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/60 text-slate-300">
                      {items.map((item, index) => {
                        const sub = item.unitPrice * item.quantity;
                        const taxSub = sub - (sub / 1.12);
                        return (
                          <tr key={index} className="hover:bg-slate-850/10">
                            <td className="px-4 py-3 font-semibold text-slate-200">{item.medicineName}</td>
                            <td className="px-4 py-3 font-mono">{item.batchNumber}</td>
                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">₹{item.unitPrice}</td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-200">₹{sub.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center text-slate-400 text-[10px]">
                              CGST (6%): ₹{(taxSub / 2).toFixed(2)}<br/>
                              SGST (6%): ₹{(taxSub / 2).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300">
                                <FiTrash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Total summary & Submission */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center bg-slate-900">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Grand Total (GST Incl.)</div>
                  <div className="text-lg font-black text-slate-100">
                    ₹{items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={submitInvoice}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl shadow-lg shadow-teal-600/20 transition-all"
                >
                  Create Bill & Print Invoice
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Historical sales log (1/3 width) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[550px]">
          <h2 className="font-bold text-sm text-slate-200 mb-4 flex items-center">
            <FiFileText className="text-teal-400 mr-2" /> Invoices Ledger
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : sales.length === 0 ? (
              <div className="text-slate-500 text-center py-12">No invoices issued yet.</div>
            ) : (
              sales.map((s) => (
                <div key={s.id} className="p-3.5 bg-slate-850/30 border border-slate-800 rounded-2xl space-y-2 relative group hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center font-bold text-slate-200">
                    <span>Invoice #{s.id}</span>
                    <span className="text-teal-400">₹{s.totalAmount}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <p>Customer: {s.customerName}</p>
                    <p>GST Charged: ₹{s.gstAmount}</p>
                    <p>Date: {new Date(s.saleDate).toLocaleString('en-IN')}</p>
                  </div>
                  <button 
                    onClick={() => setShowReceipt(s)}
                    className="absolute bottom-3.5 right-3.5 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Print Receipt"
                  >
                    <FiPrinter size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Invoice receipt print dialog */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans text-[11px] text-slate-900">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl flex flex-col h-[520px]">
            {/* Close button */}
            <button 
              onClick={() => setShowReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <FiX size={16} />
            </button>

            {/* Printable Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5" id="printable-invoice">
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-300">
                <h2 className="text-base font-extrabold tracking-tight text-teal-600">MEDISTOCK APOTHECARY</h2>
                <p className="text-[9px] text-slate-500 leading-normal">
                  Sector 15, Dwarka, New Delhi - 110075<br/>
                  Phone: +91 98765 43210 | GSTIN: 07AAAAM4567A1Z1
                </p>
                <div className="inline-block mt-2 px-3 py-0.5 bg-slate-100 rounded text-[9px] font-bold tracking-wide uppercase">
                  TAX INVOICE / CASH BILL
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="grid grid-cols-2 gap-y-1 text-[10px] pb-3 border-b border-slate-200">
                <p><span className="text-slate-500">Invoice ID:</span> <span className="font-bold">GST-{showReceipt.id}</span></p>
                <p className="text-right"><span className="text-slate-500">Date:</span> <span className="font-bold">{new Date(showReceipt.saleDate).toLocaleDateString('en-IN')}</span></p>
                <p><span className="text-slate-500">Customer:</span> <span className="font-bold">{showReceipt.customerName}</span></p>
                <p className="text-right"><span className="text-slate-500">Time:</span> <span className="font-bold">{new Date(showReceipt.saleDate).toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}</span></p>
                <p><span className="text-slate-500">Phone:</span> <span className="font-bold">{showReceipt.customerPhone}</span></p>
                <p className="text-right"><span className="text-slate-500">Payment:</span> <span className="font-bold">{showReceipt.paymentMode}</span></p>
              </div>

              {/* Invoice Items */}
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-350 text-slate-600 font-extrabold">
                    <th className="py-2">Item Description</th>
                    <th className="py-2">Batch</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {showReceipt.items.map((item, i) => (
                    <tr key={i} className="text-slate-800">
                      <td className="py-2 font-bold">{item.medicineName}</td>
                      <td className="py-2 font-mono text-[9px]">{item.batchNumber}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">₹{item.unitPrice}</td>
                      <td className="py-2 text-right font-bold">₹{(item.unitPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Invoicing Totals */}
              <div className="pt-3 border-t border-slate-300 space-y-1.5 text-[10px] font-medium text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal (Net Value):</span>
                  <span>₹{(showReceipt.totalAmount - showReceipt.gstAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[9px]">
                  <span>CGST (6%):</span>
                  <span>₹{(showReceipt.gstAmount / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[9px] pb-2 border-b border-slate-200">
                  <span>SGST (6%):</span>
                  <span>₹{(showReceipt.gstAmount / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-900 pt-1">
                  <span>GRAND TOTAL (₹):</span>
                  <span>₹{showReceipt.totalAmount}</span>
                </div>
              </div>

              {/* Invoice Footer note */}
              <div className="text-center text-[9px] text-slate-400 pt-3 border-t border-dashed border-slate-300">
                Thank you for visiting! Get well soon.<br/>
                * Medicines once sold cannot be returned or exchanged. *
              </div>
            </div>

            {/* Print button */}
            <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
              <button 
                onClick={() => setShowReceipt(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-600/10"
              >
                <FiPrinter size={13} />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
