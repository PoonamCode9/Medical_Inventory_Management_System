import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import InventoryAnalytics from '../../components/analytics/InventoryAnalytics';

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  // States
  const [tasks, setTasks] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [pendingUpdates, setPendingUpdates] = useState(0);
  const [activities, setActivities] = useState([]);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const summaryRes = await api.get('/api/dashboard/summary');
      if (summaryRes.data && summaryRes.data.success) {
        const d = summaryRes.data.data;
        setAvailableCount(d.totalMedicines);
        // Map low stock or near-expiry counts
        setPendingUpdates(d.lowStock);
      }
      
      // Default workstation checklists
      setTasks([
        { id: 101, text: 'Inspect temperature of refrigerator shelf C (Target: 2-8°C)', completed: false, category: 'Storage' },
        { id: 102, text: 'Verify batch barcodes for newly delivered carton', completed: false, category: 'Verification' }
      ]);
      setActivities([]);
    } catch (err) {
      console.error('Error loading staff dashboard summary:', err);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    const handleWriteSuccess = () => {
      fetchStaffData();
    };
    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedStatus = !task.completed;
          const newActivity = {
            id: Date.now(),
            action: updatedStatus ? 'Completed task' : 'Reopened task',
            detail: task.text,
            time: 'Just now'
          };
          setActivities([newActivity, ...activities]);
          return { ...task, completed: updatedStatus };
        }
        return task;
      })
    );
  };

  const handleAddMockTask = () => {
    const mockTasksList = [
      { id: 101, text: 'Inspect temperature of refrigerator shelf C (Target: 2-8°C)', completed: false, category: 'Storage' },
      { id: 102, text: 'Verify batch barcodes for newly delivered carton', completed: false, category: 'Verification' },
      { id: 103, text: 'Clean dispensing counter station 3 and log sanitization', completed: false, category: 'Sanitation' }
    ];
    const currentIds = tasks.map(t => t.id);
    const nextTask = mockTasksList.find(t => !currentIds.includes(t.id));
    if (nextTask) {
      setTasks([...tasks, nextTask]);
    } else {
      alert('All mock tasks are already added to your queue.');
    }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const CardSkeleton = () => (
    <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-2.5 bg-gray-100 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Staff Workstation Dashboard</h1>
          <p className="text-xs text-gray-500">Daily checklist, routine stock audit assignments, and status trackers.</p>
        </div>
        <div className="text-xs text-slate-400 font-medium bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-[10px]">
          Duty Operator Panel
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 font-bold text-xs border-b-2 cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'border-teal-700 text-teal-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Console Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2 px-4 font-bold text-xs border-b-2 cursor-pointer transition-colors ${
            activeTab === 'analytics'
              ? 'border-teal-700 text-teal-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Inventory Analytics
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <InventoryAnalytics />
      ) : (
        <>
          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Today's Tasks */}
            <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-teal-700">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Today's Active Tasks</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-bold text-gray-800">{pendingCount}</span>
                <span className="text-xs font-semibold text-gray-400">of {tasks.length} remaining</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">Pending operations checks</span>
            </div>

            {/* Store Inventory Level */}
            <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Store Catalog Item Count</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-bold text-gray-800">{availableCount}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">Items available in catalog</span>
            </div>

            {/* Low Stock count as warnings */}
            <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Low Stock Shelves</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-bold text-amber-600">{pendingUpdates}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">Below target buffer limits</span>
            </div>
          </>
        )}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Tasks Checklist */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-700">Operational Checklist & Tasks</h3>
                <p className="text-[10px] text-gray-400">Complete the assignments below to maintain pharmaceutical compliance.</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gray-150 rounded w-full"></div>
                <div className="h-10 bg-gray-100 rounded w-full"></div>
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-start p-3 border rounded-[10px] transition-all cursor-pointer select-none ${
                      task.completed
                        ? 'bg-slate-50 border-gray-200 opacity-60'
                        : 'bg-white border-gray-200 hover:border-teal-600 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-teal-700 focus:ring-teal-700/20 h-4 w-4 cursor-pointer"
                      />
                    </div>
                    <div className="ml-3 flex-1 flex justify-between items-start">
                      <p className={`text-xs font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.text}
                      </p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        task.completed ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-teal-50 text-teal-700 border-teal-100'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-10 text-center">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-355 mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-gray-700">No tasks assigned for today.</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Check back later or click below to pull mock tasks.</p>
              </div>
            )}
          </div>

          {!loading && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
              <button
                onClick={handleAddMockTask}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold rounded-card text-[11px] cursor-pointer"
              >
                Pull Daily Workstation Task
              </button>
            </div>
          )}
        </div>

        {/* Activity Panel */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b border-gray-100 pb-3">My Activity Logs</h3>
            
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-150 rounded w-full"></div>
                <div className="h-6 bg-gray-100 rounded w-full"></div>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start text-xs">
                    <div className="mr-2.5 mt-1">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-gray-800">{act.action}: </span>
                      <span className="text-gray-500 text-[11px]">{act.detail}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-8 text-center text-gray-400">
                <svg className="w-6 h-6 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] font-semibold">No recent activity logged.</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 text-[10px] text-gray-400 text-center font-medium leading-relaxed">
            Staff Workstation Duty log &bull; Audit Trail Active
          </div>
        </div>
      </div>
    </>
  )}
</div>

  );
}
