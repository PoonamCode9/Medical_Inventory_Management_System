import React, { useEffect, useState } from 'react';
import API from '../api/Api';
import { ShoppingCart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const DispenseSale = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/medicines');
      setMedicines(res.data);
    } catch (err) {
      console.error('Failed to load medicines:', err);
    }
  };

  const handleSale = async (e) => {
    e.preventDefault();
    if (!selectedMedicineId || !quantity || quantity <= 0) {
      setMessage({ type: 'error', text: 'Please select a valid medicine and quantity.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await API.post(`/sales?medicineId=${selectedMedicineId}&quantity=${quantity}`);
      setMessage({ type: 'success', text: 'Sale processed successfully! Stock updated & Log created.' });
      setQuantity('');
      setSelectedMedicineId('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data || 'Failed to process sale. Check stock.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-9 bg-slate-50 min-h-screen flex justify-center items-start">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-blue-600" /> Dispense Medicine (Sale)
          </h2>
          <p className="text-gray-500 text-sm mt-1">Record medicine sales and update stock instantly.</p>
        </div>

        {message.text && (
          <div className={`p-3 rounded-md mb-5 text-sm flex items-start gap-2 border ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSale} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Select Medicine <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedMedicineId}
              onChange={(e) => setSelectedMedicineId(e.target.value)}
              required
            >
              <option value="">-- Choose Medicine --</option>
              {medicines.map((m) => (
                <option key={m.medicineId} value={m.medicineId}>
                  {m.medicineName} (Batch: {m.batchNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Quantity to Sell <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:opacity-60 text-white font-medium py-3 px-4 rounded-md transition-colors text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              'Confirm & Dispense'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DispenseSale;