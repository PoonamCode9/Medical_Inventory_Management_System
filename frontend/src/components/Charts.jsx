import React from 'react';

// 1. Stock In vs Stock Out Trends Chart
export function StockTrendChart({ data = [] }) {
    const defaultData = [
        { label: 'Jan', inVal: 450, outVal: 320 },
        { label: 'Feb', inVal: 380, outVal: 290 },
        { label: 'Mar', inVal: 520, outVal: 410 },
        { label: 'Apr', inVal: 460, outVal: 380 },
        { label: 'May', inVal: 610, outVal: 490 },
        { label: 'Jun', inVal: 550, outVal: 430 },
    ];

    const chartData = data.length > 0 ? data : defaultData;
    const maxVal = Math.max(...chartData.flatMap(d => [d.inVal || d.stockIn || 0, d.outVal || d.stockOut || 0]), 100);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-end gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-blue-600"></span>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Stock In</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-emerald-500"></span>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Stock Out</span>
                </div>
            </div>

            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
                {chartData.map((item, idx) => {
                    const inV = item.inVal || item.stockIn || 0;
                    const outV = item.outVal || item.stockOut || 0;
                    const inHeight = Math.round((inV / maxVal) * 100);
                    const outHeight = Math.round((outV / maxVal) * 100);

                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                            <div className="w-full flex items-end justify-center gap-1.5 h-full">
                                <div
                                    style={{ height: `${inHeight}%` }}
                                    className="w-3.5 bg-blue-500 hover:bg-blue-600 rounded-t transition-all relative group-hover:opacity-90"
                                >
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded z-10 whitespace-nowrap">
                                        +{inV}
                                    </span>
                                </div>
                                <div
                                    style={{ height: `${outHeight}%` }}
                                    className="w-3.5 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all relative group-hover:opacity-90"
                                >
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded z-10 whitespace-nowrap">
                                        -{outV}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                                {item.label || item.month}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 2. Category Distribution Bar Chart
export function CategoryBarChart({ categories = [], medicines = [] }) {
    const counts = categories.map(c => {
        const catName = c.name || c.categoryName || (typeof c === 'string' ? c : 'General');
        const totalItems = medicines.filter(m => (m.categoryName || m.category?.name || 'General') === catName).length;
        return { name: catName, count: totalItems };
    }).filter(c => c.count > 0);

    const displayData = counts.length > 0 ? counts.slice(0, 5) : [
        { name: 'Analgesics', count: 28 },
        { name: 'Antibiotics', count: 19 },
        { name: 'Cardiovascular', count: 14 },
        { name: 'Antihistamines', count: 12 },
        { name: 'Supplements', count: 24 },
    ];

    const maxCount = Math.max(...displayData.map(d => d.count), 1);

    return (
        <div className="space-y-3.5 pt-2">
            {displayData.map((item, idx) => {
                const percentage = Math.round((item.count / maxCount) * 100);
                return (
                    <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="truncate max-w-[180px]">{item.name}</span>
                            <span className="font-mono text-slate-500">{item.count} items</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                style={{ width: `${percentage}%` }}
                                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// 3. Stock Health & Status Donut Chart
export function StockStatusDonut({ optimal = 70, low = 20, out = 10 }) {
    const total = optimal + low + out || 1;
    const optimalPct = Math.round((optimal / total) * 100);
    const lowPct = Math.round((low / total) * 100);
    const outPct = 100 - optimalPct - lowPct;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="relative h-36 w-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                        cx="18" cy="18" r="15.915"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeDasharray={`${optimalPct} ${100 - optimalPct}`}
                        strokeDashoffset="0"
                    />
                    <circle
                        cx="18" cy="18" r="15.915"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        strokeDasharray={`${lowPct} ${100 - lowPct}`}
                        strokeDashoffset={`-${optimalPct}`}
                    />
                    <circle
                        cx="18" cy="18" r="15.915"
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="3.5"
                        strokeDasharray={`${outPct} ${100 - outPct}`}
                        strokeDashoffset={`-${optimalPct + lowPct}`}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-slate-800 dark:text-white">{optimalPct}%</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Optimal</span>
                </div>
            </div>

            <div className="space-y-2 text-xs w-full max-w-[150px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">In Stock</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-white">{optimal}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Low Stock</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-white">{low}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Out of Stock</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-white">{out}</span>
                </div>
            </div>
        </div>
    );
}

// 4. Expiry Horizon Risk Analysis Chart
export function ExpiryHorizonChart({ batches = [] }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let under30 = 0, under60 = 0, under90 = 0, safe = 0;

    batches.forEach(b => {
        const d = b.expiryDate || b.expiry_date;
        if (!d) return;
        const diff = Math.ceil((new Date(d) - today) / (1000 * 60 * 60 * 24));
        if (diff <= 30) under30 += 1;
        else if (diff <= 60) under60 += 1;
        else if (diff <= 90) under90 += 1;
        else safe += 1;
    });

    const horizons = [
        { label: '≤ 30 Days (Critical)', count: under30 || 2, color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
        { label: '31 - 60 Days (Warning)', count: under60 || 5, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
        { label: '61 - 90 Days (Upcoming)', count: under90 || 8, color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
        { label: '> 90 Days (Secure)', count: safe || 34, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    ];

    const total = horizons.reduce((acc, h) => acc + h.count, 0) || 1;

    return (
        <div className="space-y-3.5 pt-2">
            {horizons.map((h, i) => (
                <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                        <span className={h.text}>{h.label}</span>
                        <span className="font-mono text-slate-500">{h.count} batches ({Math.round((h.count / total) * 100)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            style={{ width: `${Math.round((h.count / total) * 100)}%` }}
                            className={`h-full ${h.color} rounded-full transition-all duration-500`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}