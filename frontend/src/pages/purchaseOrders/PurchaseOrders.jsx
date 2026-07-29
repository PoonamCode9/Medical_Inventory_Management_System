import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';

export default function PurchaseOrders() {
  const { triggerToast } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [ordersList, setOrdersList] = useState([]);
  const [orderFilter, setOrderFilter] = useState('ALL'); // 'ALL', 'PENDING', 'RECEIVED', 'CANCELLED'

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/purchase-orders');
      if (res.data && Array.isArray(res.data.data)) {
        setOrdersList(res.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to fetch purchase orders.', 'DANGER');
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleWriteSuccess = () => {
      console.log('Real-time sync: reloading purchase orders list');
      fetchOrders();
    };

    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  const handleStatusUpdate = async (id, statusValue) => {
    if (window.confirm(`Are you sure you want to mark purchase order #${id} as ${statusValue}?`)) {
      try {
        const res = await api.put(`/api/purchase-orders/${id}/status`, { status: statusValue });
        if (res.data && res.data.success) {
          triggerToast(`Purchase order marked as ${statusValue}.`, 'SUCCESS');
          fetchOrders();
        }
      } catch (err) {
        console.error(err);
        triggerToast('Failed to update status.', 'DANGER');
      }
    }
  };

  const filteredOrders = ordersList.filter(o => {
    if (orderFilter === 'PENDING') return o.status === 'PENDING';
    if (orderFilter === 'RECEIVED') return o.status === 'RECEIVED';
    if (orderFilter === 'CANCELLED') return o.status === 'CANCELLED';
    return true;
  });

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-3.5"><div className="h-3.5 bg-gray-200 rounded w-1/4"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-150 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-3 bg-gray-100 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-150 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-3 bg-gray-200 rounded w-1/3"></div></td>
      <td className="p-3.5 text-center"><div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
    </tr>
  );

  return (
    <div className="space-y-6 font-sans min-h-screen pb-10">
      {/* Header Banner */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Purchase Orders & Procurement</h1>
          <p className="text-xs text-gray-500">Draft PO contracts, verify shipments, and update inventory levels automatically.</p>
        </div>
        <Link
          to="/purchase-orders/new"
          className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Purchase Order
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {['ALL', 'PENDING', 'RECEIVED', 'CANCELLED'].map((f) => (
          <button
            key={f}
            onClick={() => setOrderFilter(f)}
            className={`px-3 py-1.5 rounded-card text-xs font-bold border transition-colors cursor-pointer ${
              orderFilter === f
                ? 'bg-teal-800 text-white border-teal-800'
                : 'bg-white text-gray-500 border-gray-300 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' ? 'All Orders' : f}
          </button>
        ))}
      </div>

      {/* Grid Table */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 font-bold">Order ID</th>
                <th className="p-3.5 font-bold">Supplier Name</th>
                <th className="p-3.5 font-bold">Order Date</th>
                <th className="p-3.5 font-bold text-right">Total Amount</th>
                <th className="p-3.5 font-bold">Ordered By</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  let statusColor = 'text-amber-700 bg-amber-50 border border-amber-100';
                  if (order.status === 'RECEIVED') statusColor = 'text-green-700 bg-green-50 border border-green-100';
                  if (order.status === 'CANCELLED') statusColor = 'text-gray-500 bg-slate-100 border border-slate-200';

                  return (
                    <tr key={order.purchaseOrderId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-gray-800">#PO-{order.purchaseOrderId}</td>
                      <td className="p-3.5 text-gray-700 font-semibold">{order.supplier?.supplierName}</td>
                      <td className="p-3.5 text-gray-400 font-mono">{order.orderDate}</td>
                      <td className="p-3.5 font-bold text-gray-800 text-right">₹{order.totalAmount?.toLocaleString('en-IN') || '0.00'}</td>
                      <td className="p-3.5 text-gray-500 font-medium">{order.orderedBy?.email}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-[5px] uppercase ${statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {order.status === 'PENDING' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(order.purchaseOrderId, 'RECEIVED')}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-card text-[10px] cursor-pointer shadow-sm transition-colors"
                              title="Receive stock lines"
                            >
                              Receive
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.purchaseOrderId, 'CANCELLED')}
                              className="px-2.5 py-1 border border-gray-300 hover:bg-slate-100 text-gray-655 font-bold rounded-card text-[10px] cursor-pointer transition-colors"
                              title="Cancel order"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No Actions</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-400 bg-slate-50/20">
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-4xl mb-3">📦</span>
                      <h4 className="text-sm font-bold text-gray-700">No purchase orders found.</h4>
                      <p className="text-xs text-gray-400 mt-1 mb-4">Start by creating your first purchase order sheet.</p>
                      <Link
                        to="/purchase-orders/new"
                        className="py-1.5 px-3.5 bg-[#0F766E] hover:bg-teal-800 text-white font-bold rounded-card text-xs cursor-pointer shadow-sm transition-colors"
                      >
                        + Create Purchase Order
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
