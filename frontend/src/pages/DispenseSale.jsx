import React, { useEffect, useState } from 'react';
import API from '../api/Api';
import { ShoppingCart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DispenseSale = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [quantity, setQuantity] = useState('');
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
      toast.error('Failed to load medicines list.');
    }
  };

  const handleSale = async (e) => {
    e.preventDefault();

    if (!selectedMedicineId) {
      toast.error('Please select a medicine!');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      toast.error('Please enter a valid quantity!');
      return;
    }

    setLoading(true);

    try {
      await API.post(`/sales?medicineId=${selectedMedicineId}&quantity=${quantity}`);
      toast.success('Sale processed successfully! Stock updated.');
      setQuantity('');
      setSelectedMedicineId('');
    } catch (err) {
      const errorMsg = err.response?.data || 'Failed to process sale. Check stock.';
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Failed to process sale.');
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

        <form onSubmit={handleSale} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Select Medicine <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedMedicineId}
              onChange={(e) => setSelectedMedicineId(e.target.value)}
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