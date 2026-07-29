import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null); // null means showing list
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [toastMessage, setToastMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const reportsList = [
    {
      id: 'inventory-summary',
      title: 'Inventory Summary',
      description: 'Overview of total medicines count, total valuation cost, low stock alerts, and expired items count.'
    },
    {
      id: 'current-stock',
      title: 'Current Stock Report',
      description: 'Granular details of all medicines in stock, including batch reference, unit price, quantity, and valuation.'
    },
    {
      id: 'expired-medicines',
      title: 'Expired Medicines Report',
      description: 'Audit records of medicines whose shelf-life expiration dates have already passed.'
    },
    {
      id: 'expiring-soon',
      title: 'Expiring Soon Report',
      description: 'Timelines listing medicines expiring within 60 days (including critical 30-day warnings).'
    },
    {
      id: 'low-stock',
      title: 'Low Stock Report',
      description: 'Catalog listing of medicines whose stock counts have fallen below set minimum thresholds.'
    },
    {
      id: 'stock-in',
      title: 'Stock In Report',
      description: 'Audit logs tracking all stock increments, purchase receiving, and initial catalog creations.'
    },
    {
      id: 'stock-out',
      title: 'Stock Out Report',
      description: 'Audit logs of all stock reductions, dispensations, and stock write-offs.'
    },
    {
      id: 'purchase',
      title: 'Purchase Report',
      description: 'Consolidated logs of all procurement purchase orders, labs orders, and fulfillment statuses.'
    },
    {
      id: 'notifications',
      title: 'Notification Report',
      description: 'Audit log of system notifications, including module details, priority levels, recipient roles, and read status.'
    }
  ];

  const fetchReportData = async (reportId) => {
    setLoading(true);
    setCurrentPage(1);
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setSortField(null);
    try {
      const res = await api.get(`/api/reports/data/${reportId}`);
      if (res.data && Array.isArray(res.data.data)) {
        setReportData(res.data.data);
      } else {
        setReportData([]);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to fetch report data.');
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleSelectReport = (reportId) => {
    const report = reportsList.find(r => r.id === reportId);
    setSelectedReport(report);
    fetchReportData(reportId);
  };

  const handleBack = () => {
    setSelectedReport(null);
    setReportData([]);
    setStartDate('');
    setEndDate('');
  };

  // Sorting helper
  const handleSort = (field) => {
    let order = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortField(field);
    setSortOrder(order);
  };

  // Prepare filtered and sorted data
  const getProcessedData = () => {
    let result = [...reportData];

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(val => 
          val !== null && val !== undefined && val.toString().toLowerCase().includes(query)
        );
      });
    }

    // Date Range filter
    if (startDate || endDate) {
      result = result.filter(item => {
        const dateKey = Object.keys(item).find(key => 
          key.toLowerCase().includes('date') || key.toLowerCase().includes('time') || key.toLowerCase().includes('at')
        );
        if (!dateKey) return true;

        const itemDateStr = item[dateKey];
        if (!itemDateStr) return false;

        const itemTime = new Date(itemDateStr).getTime();
        
        if (startDate) {
          const startTime = new Date(startDate).getTime();
          if (itemTime < startTime) return false;
        }
        if (endDate) {
          const endTime = new Date(endDate + 'T23:59:59').getTime();
          if (itemTime > endTime) return false;
        }

        return true;
      });
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'string') {
          return sortOrder === 'asc' 
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
      });
    }

    return result;
  };

  const processedData = getProcessedData();

  // Pagination calculations
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = processedData.slice(startIndex, endIndex);

  // Dynamic Live Metrics calculation
  const getLiveMetrics = () => {
    if (!selectedReport || processedData.length === 0) return null;

    let totalQty = 0;
    let totalVal = 0;
    let statusCounts = {};
    let hasQty = false;
    let hasVal = false;

    processedData.forEach(item => {
      // Find quantity
      const qtyKey = Object.keys(item).find(k => k.toLowerCase() === 'quantity');
      if (qtyKey) {
        totalQty += (parseInt(item[qtyKey], 10) || 0);
        hasQty = true;
      }

      // Find value/amount
      const valKey = Object.keys(item).find(k => 
        k.toLowerCase() === 'totalvalue' || k.toLowerCase() === 'totalamount' || k.toLowerCase() === 'purchaseprice'
      );
      if (valKey) {
        let val = parseFloat(item[valKey]);
        if (!isNaN(val)) {
          if (valKey.toLowerCase() === 'purchaseprice' && qtyKey) {
            totalVal += val * (parseInt(item[qtyKey], 10) || 0);
          } else {
            totalVal += val;
          }
          hasVal = true;
        }
      }

      // Expiry/Status tracking
      const statusKey = Object.keys(item).find(k => k === 'expiryStatus' || k === 'status');
      if (statusKey && item[statusKey]) {
        const status = item[statusKey].toString();
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      }
    });

    return {
      count: processedData.length,
      totalQty,
      totalVal,
      statusCounts,
      hasQty,
      hasVal
    };
  };

  const metrics = getLiveMetrics();

  // Export to Excel / CSV
  const exportToExcel = () => {
    if (processedData.length === 0) {
      triggerToast('No data available to export.');
      return;
    }
    const headers = Object.keys(processedData[0]);
    const csvRows = [headers.join(',')];

    processedData.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val !== null && val !== undefined ? val : '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedReport.id}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF using print window
  const exportToPDF = () => {
    if (processedData.length === 0) {
      triggerToast('No data available to export.');
      return;
    }
    const headers = Object.keys(processedData[0]);
    
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <html>
        <head>
          <title>${selectedReport.title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { color: #0F766E; margin-bottom: 5px; }
            p { font-size: 12px; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background-color: #F8FAFC; color: #475569; font-weight: bold; border-bottom: 2px solid #E2E8F0; text-align: left; }
            th, td { padding: 10px; border-bottom: 1px solid #E2E8F0; }
            tr:nth-child(even) { background-color: #F8FAFC; }
            .badge { display: inline-block; padding: 3px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
            .badge-danger { background-color: #FEE2E2; color: #991B1B; }
            .badge-warning { background-color: #FEF3C7; color: #92400E; }
            .badge-success { background-color: #DCFCE7; color: #166534; }
          </style>
        </head>
        <body>
          <h1>${selectedReport.title}</h1>
          <p>Generated on ${new Date().toLocaleString()} | MediStock Medical Inventory Management System</p>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h.toUpperCase()}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${processedData.map(row => `
                <tr>
                  ${headers.map(h => {
                    const val = row[h];
                    let displayVal = val !== null && val !== undefined ? val : 'N/A';
                    if (h === 'expiryStatus' || h === 'status') {
                      let badgeClass = 'badge-success';
                      if (displayVal === 'Expired' || displayVal === 'Critical' || displayVal === 'Low Stock' || displayVal === 'Out of Stock') badgeClass = 'badge-danger';
                      else if (displayVal === 'Expiring Soon' || displayVal === 'PENDING') badgeClass = 'badge-warning';
                      return `<td><span class="badge ${badgeClass}">${displayVal}</span></td>`;
                    }
                    return `<td>${displayVal}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getTableHeader = () => {
    if (reportData.length === 0) return null;
    const headers = Object.keys(reportData[0]);
    return (
      <tr className="border-b border-gray-200 bg-slate-50 text-gray-500 font-bold uppercase text-[9px] tracking-wider">
        {headers.map(h => (
          <th 
            key={h} 
            onClick={() => handleSort(h)} 
            className="p-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
          >
            <div className="flex items-center space-x-1">
              <span>{h.replace(/([A-Z])/g, ' $1').trim()}</span>
              {sortField === h ? (
                sortOrder === 'asc' ? <span>▲</span> : <span>▼</span>
              ) : <span className="opacity-30">↕</span>}
            </div>
          </th>
        ))}
      </tr>
    );
  };

  const getTableRows = () => {
    if (paginatedData.length === 0) return null;
    const headers = Object.keys(reportData[0]);
    return paginatedData.map((row, idx) => (
      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
        {headers.map(h => {
          const val = row[h];
          let displayVal = val !== null && val !== undefined ? val : 'N/A';
          if (typeof displayVal === 'boolean') {
            displayVal = displayVal ? 'Yes' : 'No';
          }
          if (h.toLowerCase().includes('price') || h.toLowerCase().includes('value') || h.toLowerCase().includes('amount')) {
            if (typeof val === 'number') {
              displayVal = `₹${val.toLocaleString('en-IN')}`;
            }
          }
          if (h === 'expiryStatus' || h === 'status') {
            let badgeStyle = 'text-green-700 bg-green-50 border border-green-200';
            if (displayVal === 'Expired' || displayVal === 'Critical' || displayVal === 'Low Stock') {
              badgeStyle = 'text-red-700 bg-red-50 border border-red-200';
            } else if (displayVal === 'Expiring Soon') {
              badgeStyle = 'text-amber-700 bg-amber-50 border border-amber-200';
            }
            return (
              <td key={h} className="p-3.5">
                <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-[5px] uppercase ${badgeStyle}`}>
                  {displayVal}
                </span>
              </td>
            );
          }
          return (
            <td key={h} className="p-3.5 font-medium text-gray-700 max-w-[200px] truncate font-mono">
              {displayVal.toString()}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-teal-850 text-white text-xs font-bold py-3 px-5 rounded-[10px] shadow-lg border border-teal-650 z-50">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          {selectedReport ? selectedReport.title : 'Enterprise Reports Hub'}
        </h1>
        <p className="text-xs text-gray-500">
          {selectedReport 
            ? selectedReport.description 
            : 'Extract dynamic records, audit trails, and financial metrics in responsive spreadsheets and layout views.'}
        </p>
      </div>

      {!selectedReport ? (
        /* Report Cards List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reportsList.map((report) => (
            <div 
              key={report.id} 
              className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-600 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleSelectReport(report.id)}
            >
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{report.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{report.description}</p>
              </div>
              <div className="text-[10px] text-teal-700 font-bold hover:underline">
                Open Report &rarr;
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detail Table View */
        <div className="space-y-4">
          {/* Live Metrics Summary Cards */}
          {metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Filtered Records</div>
                <div className="text-xl font-bold text-gray-800 mt-1">{metrics.count}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Matching current filters</div>
              </div>
              {metrics.hasQty && (
                <div className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Total Items Qty</div>
                  <div className="text-xl font-bold text-teal-850 mt-1">{metrics.totalQty.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Cumulative stock units</div>
                </div>
              )}
              {metrics.hasVal && (
                <div className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Total Valuation</div>
                  <div className="text-xl font-bold text-teal-850 mt-1">₹{metrics.totalVal.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Based on filtered items</div>
                </div>
              )}
              {Object.keys(metrics.statusCounts).length > 0 && (
                <div className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Status Breakdown</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(metrics.statusCounts).map(([status, count]) => {
                      let badge = 'bg-green-50 text-green-700';
                      if (status === 'Expired' || status === 'Critical' || status === 'Low Stock' || status === 'Out of Stock') badge = 'bg-red-50 text-red-750';
                      else if (status === 'Expiring Soon' || status === 'PENDING') badge = 'bg-amber-50 text-amber-800';
                      return (
                        <span key={status} className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${badge}`}>
                          {status}: {count}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={handleBack}
                className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer flex items-center gap-1.5"
              >
                &larr; Back
              </button>

              <button 
                onClick={() => fetchReportData(selectedReport.id)}
                className="py-1.5 px-3 border border-gray-305 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer flex items-center gap-1.5"
                title="Reload Report Data"
              >
                Sync
              </button>
            </div>

            {/* Date range filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-400">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-gray-300 rounded-[8px] py-1 px-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-700"
                />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-400">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 border border-gray-300 rounded-[8px] py-1 px-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-700"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-[10px] text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                  title="Clear Date Filters"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Middle Search Box */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search report table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-gray-300 rounded-[8px] text-xs font-semibold focus:bg-white focus:border-teal-700 focus:outline-none transition-all placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={exportToExcel}
                className="w-full md:w-auto py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                Export Excel
              </button>
              <button
                onClick={exportToPDF}
                className="w-full md:w-auto py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                Print PDF
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  {getTableHeader()}
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {loading ? (
                    <tr>
                      <td colSpan={reportData.length > 0 ? Object.keys(reportData[0]).length : 5} className="py-12">
                        <div className="flex flex-col items-center justify-center">
                          <span className="w-8 h-8 border-3 border-teal-650/30 border-t-teal-700 rounded-full animate-spin"></span>
                          <span className="text-[11px] font-bold text-gray-450 mt-3.5">Loading data metrics...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    getTableRows()
                  ) : (
                    <tr>
                      <td colSpan={reportData.length > 0 ? Object.keys(reportData[0]).length : 5} className="text-center py-16 text-gray-400 bg-slate-50/20">
                        <div className="flex flex-col justify-center items-center">
                          <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-400 mb-3">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-bold text-gray-700">No records found.</h4>
                          <p className="text-xs text-gray-400 mt-0.5">We couldn't find any data matching the search filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {processedData.length > 0 && (
              <div className="bg-white px-4 py-3.5 flex items-center justify-between border-t border-gray-150">
                <div className="text-[10px] text-gray-400 font-semibold font-mono">
                  Showing {startIndex + 1} - {endIndex} of {totalItems} items
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="py-1 px-2.5 border border-gray-200 hover:border-slate-350 hover:bg-slate-50 text-gray-600 rounded-[6px] text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-bold text-gray-600 px-2 font-mono">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="py-1 px-2.5 border border-gray-200 hover:border-slate-350 hover:bg-slate-50 text-gray-600 rounded-[6px] text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
