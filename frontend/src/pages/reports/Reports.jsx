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

  // Dropdown filter options
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterExpiryStatus, setFilterExpiryStatus] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catsRes, suppsRes] = await Promise.all([
          api.get('/api/categories').catch(() => ({ data: { data: [] } })),
          api.get('/api/suppliers').catch(() => ({ data: { data: [] } }))
        ]);
        if (catsRes.data && Array.isArray(catsRes.data.data)) {
          setCategories(catsRes.data.data);
        }
        if (suppsRes.data && Array.isArray(suppsRes.data.data)) {
          setSuppliers(suppsRes.data.data);
        }
      } catch (err) {
        console.error('Error loading reports filters:', err);
      }
    };
    loadFilters();
  }, []);

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
    setFilterCategory('');
    setFilterSupplier('');
    setFilterExpiryStatus('');
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
    setFilterCategory('');
    setFilterSupplier('');
    setFilterExpiryStatus('');
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

    // Category Filter
    if (filterCategory) {
      result = result.filter(item => {
        const catName = item.categoryName || item.category;
        return catName && catName.toString().toLowerCase() === filterCategory.toLowerCase();
      });
    }

    // Supplier Filter
    if (filterSupplier) {
      result = result.filter(item => {
        const suppName = item.supplierName || item.supplier;
        return suppName && suppName.toString().toLowerCase() === filterSupplier.toLowerCase();
      });
    }

    // Expiry/Status Filter
    if (filterExpiryStatus) {
      result = result.filter(item => {
        const status = item.expiryStatus || item.status;
        return status && status.toString().toLowerCase() === filterExpiryStatus.toLowerCase();
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

  // Export to Excel / CSV (Filtered only, with active filter metadata)
  const exportToExcel = () => {
    if (processedData.length === 0) {
      triggerToast('No data available to export.');
      return;
    }
    const headers = Object.keys(processedData[0]);
    const csvRows = [];

    // Metadata header block documenting active filters
    const dateStr = new Date().toLocaleString('en-IN');
    csvRows.push(`"MEDISTOCK - ${selectedReport.title}"`);
    csvRows.push(`"Generated: ${dateStr}"`);
    csvRows.push(`"Total Filtered Records: ${processedData.length}"`);

    // Active filter summary
    const activeFilters = [];
    if (startDate) activeFilters.push(`From: ${startDate}`);
    if (endDate) activeFilters.push(`To: ${endDate}`);
    if (filterCategory) {
      const cat = categories.find(c => c.categoryId.toString() === filterCategory);
      if (cat) activeFilters.push(`Category: ${cat.categoryName}`);
    }
    if (filterSupplier) {
      const sup = suppliers.find(s => s.supplierId.toString() === filterSupplier);
      if (sup) activeFilters.push(`Supplier: ${sup.supplierName}`);
    }
    if (filterExpiryStatus) activeFilters.push(`Expiry Status: ${filterExpiryStatus}`);
    if (searchQuery) activeFilters.push(`Search: ${searchQuery}`);

    if (activeFilters.length > 0) {
      csvRows.push(`"Active Filters: ${activeFilters.join(' | ')}"`);
    } else {
      csvRows.push(`"Active Filters: None (showing all records)"`);
    }
    csvRows.push(''); // blank separator row

    // Column headers
    csvRows.push(headers.join(','));

    // Data rows
    processedData.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val !== null && val !== undefined ? val : '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel UTF-8
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateTag = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `medistock_${selectedReport.id}_${dateTag}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Call audit trace on backend
    api.get(`/api/reports/download/${selectedReport.id}`).catch(() => {});
    triggerToast(`${selectedReport.title} exported to CSV successfully.`);
  };


  // Export to PDF using print window
  const exportToPDF = () => {
    if (processedData.length === 0) {
      triggerToast('No data available to export.');
      return;
    }
    const headers = Object.keys(processedData[0]);

    // Build active filters string for PDF header
    const activeFilters = [];
    if (startDate) activeFilters.push(`From: ${startDate}`);
    if (endDate) activeFilters.push(`To: ${endDate}`);
    if (filterCategory) {
      const cat = categories.find(c => c.categoryId.toString() === filterCategory);
      if (cat) activeFilters.push(`Category: ${cat.categoryName}`);
    }
    if (filterSupplier) {
      const sup = suppliers.find(s => s.supplierId.toString() === filterSupplier);
      if (sup) activeFilters.push(`Supplier: ${sup.supplierName}`);
    }
    if (filterExpiryStatus) activeFilters.push(`Expiry: ${filterExpiryStatus}`);
    if (searchQuery) activeFilters.push(`Search: "${searchQuery}"`);
    const filterSummary = activeFilters.length > 0 ? activeFilters.join(' &nbsp;·&nbsp; ') : 'No filters applied — showing all records';

    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <html>
        <head>
          <title>${selectedReport.title} — MediStock Report</title>
          <style>
            @page { margin: 20mm 15mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 0; color: #1E293B; background-color: #FFF; font-size: 10px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0F766E; padding-bottom: 18px; margin-bottom: 16px; }
            .logo-section { display: flex; align-items: center; gap: 10px; }
            .logo-icon { width: 36px; height: 36px; background: #0F766E; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
            .logo-text { font-size: 22px; font-weight: 900; color: #0F766E; letter-spacing: -0.04em; }
            .logo-sub { font-size: 9px; color: #64748B; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
            .report-info { text-align: right; }
            .report-info h1 { margin: 0; font-size: 18px; font-weight: 800; color: #0F766E; }
            .report-info .meta { margin: 4px 0 0 0; font-size: 9.5px; color: #64748B; font-weight: 500; }
            .filter-bar { background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 8px 12px; margin-bottom: 16px; font-size: 9px; color: #166534; font-weight: 600; }
            .filter-bar span { font-weight: 800; color: #14532D; }
            .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
            .meta-card { background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 12px; border-radius: 7px; border-left: 3px solid #0F766E; }
            .meta-label { font-size: 8px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; }
            .meta-val { font-size: 18px; font-weight: 800; color: #0F766E; margin-top: 3px; }
            table { width: 100%; border-collapse: collapse; font-size: 9.5px; }
            th { background-color: #0F766E; color: #FFFFFF; font-weight: 700; text-transform: uppercase; font-size: 8px; letter-spacing: 0.06em; text-align: left; padding: 7px 9px; }
            td { padding: 7px 9px; border-bottom: 1px solid #E2E8F0; color: #334155; vertical-align: top; }
            tr:nth-child(even) td { background-color: #F8FAFC; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; border: 1px solid transparent; }
            .badge-danger { background-color: #FEE2E2; color: #991B1B; border-color: #FCA5A5; }
            .badge-warning { background-color: #FEF3C7; color: #92400E; border-color: #FCD34D; }
            .badge-success { background-color: #DCFCE7; color: #166534; border-color: #86EFAC; }
            .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 8px; color: #94A3B8; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <div class="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <div class="logo-text">MediStock</div>
                <div class="logo-sub">Medical Inventory Platform</div>
              </div>
            </div>
            <div class="report-info">
              <h1>${selectedReport.title}</h1>
              <div class="meta">Generated: ${new Date().toLocaleString('en-IN')} &nbsp;·&nbsp; ${processedData.length} Records</div>
            </div>
          </div>

          <div class="filter-bar">
            <span>Active Filters:</span> ${filterSummary}
          </div>

          <div class="meta-grid">
            <div class="meta-card">
              <div class="meta-label">Filtered Records</div>
              <div class="meta-val">${processedData.length}</div>
            </div>
            ${metrics && metrics.hasQty ? `
            <div class="meta-card">
              <div class="meta-label">Total Quantity</div>
              <div class="meta-val">${metrics.totalQty.toLocaleString()} units</div>
            </div>` : ''}
            ${metrics && metrics.hasVal ? `
            <div class="meta-card">
              <div class="meta-label">Total Valuation</div>
              <div class="meta-val">₹${metrics.totalVal.toLocaleString('en-IN')}</div>
            </div>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${processedData.map(row => `
                <tr>
                  ${headers.map(h => {
                    const val = row[h];
                    let displayVal = val !== null && val !== undefined ? val : '';
                    if (typeof displayVal === 'boolean') {
                      displayVal = displayVal ? 'Yes' : 'No';
                    }
                    if (h.toLowerCase().includes('price') || h.toLowerCase().includes('value') || h.toLowerCase().includes('amount')) {
                      if (typeof val === 'number') {
                        displayVal = `₹${val.toLocaleString('en-IN')}`;
                      }
                    }
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

          <div class="footer">
            <span>MediStock &copy; ${new Date().getFullYear()} — Confidential Medical Records</span>
            <span>Report ID: ${selectedReport.id} &nbsp;·&nbsp; ${new Date().toISOString()}</span>
          </div>
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
    triggerToast(`${selectedReport.title} PDF sent to print.`);
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
          let displayVal = val;
          if (val === null || val === undefined) {
             displayVal = '';
          }
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
            if (displayVal === 'Expired' || displayVal === 'Critical' || displayVal === 'Low Stock' || displayVal === 'Out of Stock') {
              badgeStyle = 'text-red-700 bg-red-50 border border-red-200';
            } else if (displayVal === 'Expiring Soon' || displayVal === 'PENDING') {
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
          <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col gap-4">
            
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4">
              
              {/* Category Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-450">Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-50 border border-gray-300 rounded-[8px] py-1 px-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-700"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
                  ))}
                </select>
              </div>

              {/* Supplier Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-455">Supplier:</span>
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="bg-slate-50 border border-gray-300 rounded-[8px] py-1 px-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-700"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map(s => (
                    <option key={s.supplierId} value={s.supplierName}>{s.supplierName}</option>
                  ))}
                </select>
              </div>

              {/* Expiry Status Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-460">Status:</span>
                <select
                  value={filterExpiryStatus}
                  onChange={(e) => setFilterExpiryStatus(e.target.value)}
                  className="bg-slate-50 border border-gray-300 rounded-[8px] py-1 px-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-700"
                >
                  <option value="">All Statuses</option>
                  <option value="Safe">Safe</option>
                  <option value="Expired">Expired</option>
                  <option value="Critical">Critical</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="PENDING">Pending</option>
                  <option value="DELIVERED">Delivered / Received</option>
                </select>
              </div>

              {/* Reset Dropdown filters */}
              {(filterCategory || filterSupplier || filterExpiryStatus) && (
                <button
                  onClick={() => { setFilterCategory(''); setFilterSupplier(''); setFilterExpiryStatus(''); }}
                  className="text-[10px] text-red-500 hover:text-red-755 font-bold cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
                    className="text-[10px] text-red-500 hover:text-red-750 font-bold ml-1 cursor-pointer"
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
