import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiDownload, FiSearch, FiFileText, FiCalendar } from 'react-icons/fi';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/api/reports`, {
        params: {
          type: reportType,
          startDate,
          endDate
        }
      });
      setReportData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleQuery = (e) => {
    e.preventDefault();
    fetchReport();
  };

  // Export to CSV client-side
  const exportToCSV = () => {
    if (reportData.length === 0) return;
    
    const headers = Object.keys(reportData[0]);
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of reportData) {
      const values = headers.map(header => {
        const val = row[header] !== undefined ? row[header] : '';
        // Escape quotes and commas
        const escaped = ('' + val).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `medistock_${reportType}_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportOptions = [
    { value: 'sales', label: 'Sales Invoices Log' },
    { value: 'purchase', label: 'Purchase Receipts Log' },
    { value: 'inventory', label: 'Current Inventory Value' },
    { value: 'lowstock', label: 'Low Stock Alarms' },
    { value: 'expiry', label: 'Batch Expiry Schedule' },
    { value: 'gst', label: 'Indian GST Ledger' },
    { value: 'profitloss', label: 'Profit & Loss Summary' }
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Reporting Center</h1>
          <p className="text-xs text-slate-400 mt-1">Audit daily sales, purchase tax ledgers, P&L summaries, and export logs to CSV.</p>
        </div>
      </div>

      {/* Query Form Selector */}
      <form onSubmit={handleQuery} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block font-semibold text-slate-400 mb-1.5 flex items-center">
            <FiFileText className="mr-1.5 text-teal-400" /> Report Category
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
          >
            {reportOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-400 mb-1.5 flex items-center">
            <FiCalendar className="mr-1.5 text-teal-400" /> From Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-400 mb-1.5 flex items-center">
            <FiCalendar className="mr-1.5 text-teal-400" /> To Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-600/10 transition-all"
          >
            <FiSearch size={14} />
            <span>Generate</span>
          </button>
          
          <button
            type="button"
            disabled={reportData.length === 0}
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 disabled:border-slate-850 text-slate-200 disabled:text-slate-600 rounded-xl font-bold flex items-center justify-center transition-all"
            title="Download CSV"
          >
            <FiDownload size={14} />
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Report Table Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : reportData.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No transaction records found matching the query criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold">
                  {Object.keys(reportData[0]).map((key) => (
                    <th key={key} className="px-5 py-3.5">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {reportData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-850/20">
                    {Object.values(row).map((val, cellIndex) => (
                      <td key={cellIndex} className="px-5 py-3.5 font-medium">
                        {/* Highlight metric values or indicators if any */}
                        {typeof val === 'string' && val.startsWith('RE-ORDER') ? (
                          <span className="text-red-400 font-bold">{val}</span>
                        ) : typeof val === 'string' && val.startsWith('EXPIRED') ? (
                          <span className="text-rose-500 font-extrabold">{val}</span>
                        ) : (
                          '' + val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
