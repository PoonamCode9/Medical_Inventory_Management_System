// Reusable UI primitives — Button, Card, Input, PhoneInput, Badge, KpiCard, etc.
import React, { useState, useEffect } from 'react';

const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
    secondary: 'bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-700 active:bg-ink-100 dark:active:bg-ink-600',
    ghost: 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 active:bg-ink-200 dark:active:bg-ink-700',
    destructive: 'bg-error text-white hover:bg-error/90 active:bg-red-700 shadow-sm',
    outline: 'border border-primary-600 text-primary-700 dark:text-primary-400 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/30 active:bg-primary-100',
};

const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-6 text-sm',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40
        disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] hover:shadow-md
        ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function IconButton({ className = '', children, ...props }) {
    return (
        <button
            className={`inline-flex items-center justify-center h-9 w-9 rounded-lg text-ink-500 dark:text-ink-400
        hover:bg-ink-100 dark:hover:bg-ink-800 active:scale-95 transition-all duration-150 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40
        ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Card({ className = '', children }) {
    return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div>
                <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">{title}</h3>
                {subtitle && <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

const badgeColors = {
    primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
    secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50',
    error: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50',
    neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
};

export function Badge({ color = 'neutral', children, className = '' }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColors[color] || badgeColors.neutral} ${className}`}>
      {children}
    </span>
    );
}

const stockStatusMap = {
    OK: { color: 'success', label: 'In Stock' },
    IN_STOCK: { color: 'success', label: 'In Stock' },
    LOW: { color: 'warning', label: 'Low Stock' },
    LOW_STOCK: { color: 'warning', label: 'Low Stock' },
    OUT: { color: 'error', label: 'Out of Stock' },
    OUT_OF_STOCK: { color: 'error', label: 'Out of Stock' },
    EXPIRE: { color: 'error', label: 'Expiring' },
    DRAFT: { color: 'neutral', label: 'Draft' },
    SENT: { color: 'info', label: 'Sent' },
    PARTIAL: { color: 'warning', label: 'Partial' },
    RECEIVED: { color: 'success', label: 'Received' },
    FULFILLED: { color: 'success', label: 'Fulfilled' },
    APPROVED: { color: 'info', label: 'Approved' },
    PENDING: { color: 'warning', label: 'Pending' },
    CANCELLED: { color: 'error', label: 'Cancelled' },
    ACTIVE: { color: 'success', label: 'Active' },
    INACTIVE: { color: 'neutral', label: 'Inactive' },
};

export function StatusBadge({ status }) {
    const cfg = stockStatusMap[status] ?? { color: 'neutral', label: status };
    return <Badge color={cfg.color}>{cfg.label}</Badge>;
}

export function Input({ label, hint, error, className = '', ...props }) {
    return (
        <div className="space-y-1.5">
            {label && <label className="block text-sm font-medium text-ink-700 dark:text-ink-300">{label}</label>}
            <input className={`input-base ${error ? 'border-error focus:ring-error/30 focus:border-error' : ''} ${className}`} {...props} />
            {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}

// ----------------------------------------------------
// INTERNATIONAL PHONE INPUT COMPONENT
// ----------------------------------------------------
const COUNTRY_CODES = [
    { code: '+91', country: 'IN', label: 'India (+91)', digits: 10, placeholder: '98200 11001' },
    { code: '+1', country: 'US', label: 'USA / Canada (+1)', digits: 10, placeholder: '202 555 0123' },
    { code: '+44', country: 'UK', label: 'UK (+44)', digits: 10, placeholder: '7911 123456' },
    { code: '+971', country: 'AE', label: 'UAE (+971)', digits: 9, placeholder: '50 123 4567' },
    { code: '+61', country: 'AU', label: 'Australia (+61)', digits: 9, placeholder: '412 345 678' },
    { code: '+65', country: 'SG', label: 'Singapore (+65)', digits: 8, placeholder: '8123 4567' },
    { code: '+49', country: 'DE', label: 'Germany (+49)', digits: 10, placeholder: '151 23456789' },
    { code: '+81', country: 'JP', label: 'Japan (+81)', digits: 10, placeholder: '90 1234 5678' },
];

export function PhoneInput({ label = 'Contact Number', value = '', onChange, error, hint, className = '' }) {
    // Parse initial value to extract country code and raw digits
    const initialCountry = COUNTRY_CODES.find(c => value && value.startsWith(c.code)) || COUNTRY_CODES[0];
    const [selectedCode, setSelectedCode] = useState(initialCountry.code);

    const getRawNumber = (fullVal, code) => {
        if (!fullVal) return '';
        if (fullVal.startsWith(code)) {
            return fullVal.slice(code.length).trim().replace(/\D/g, '');
        }
        return fullVal.replace(/\D/g, '');
    };

    const [number, setNumber] = useState(() => getRawNumber(value, selectedCode));

    useEffect(() => {
        const found = COUNTRY_CODES.find(c => value && value.startsWith(c.code));
        if (found) {
            setSelectedCode(found.code);
            setNumber(getRawNumber(value, found.code));
        } else if (value) {
            setNumber(value.replace(/\D/g, ''));
        }
    }, [value]);

    const activeCountryObj = COUNTRY_CODES.find(c => c.code === selectedCode) || COUNTRY_CODES[0];

    const handleCountryChange = (e) => {
        const newCode = e.target.value;
        setSelectedCode(newCode);
        const combined = number ? `${newCode} ${number}` : '';
        if (onChange) onChange({ target: { value: combined } });
    };

    const handleNumberChange = (e) => {
        // Enforce STRICT numerical digits only
        const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, activeCountryObj.digits);
        setNumber(onlyDigits);
        const combined = onlyDigits ? `${selectedCode} ${onlyDigits}` : '';
        if (onChange) onChange({ target: { value: combined } });
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <label className="block text-sm font-medium text-ink-700 dark:text-ink-300">{label}</label>}
            <div className="flex gap-2">
                <select
                    value={selectedCode}
                    onChange={handleCountryChange}
                    className="h-[2.375rem] px-2.5 text-xs font-semibold bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-lg text-ink-800 dark:text-ink-100 focus:outline-none focus:border-primary-500 shrink-0"
                >
                    {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.label}
                        </option>
                    ))}
                </select>
                <div className="relative flex-1">
                    <input
                        type="tel"
                        value={number}
                        onChange={handleNumberChange}
                        placeholder={activeCountryObj.placeholder}
                        maxLength={activeCountryObj.digits}
                        className={`input-base ${error ? 'border-error focus:ring-error/30 focus:border-error' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-400">
                        {number.length}/{activeCountryObj.digits}
                    </span>
                </div>
            </div>
            {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}

export function Select({ label, className = '', children, ...props }) {
    return (
        <div className="space-y-1.5">
            {label && <label className="block text-sm font-medium text-ink-700 dark:text-ink-300">{label}</label>}
            <select className={`input-base cursor-pointer ${className}`} {...props}>
                {children}
            </select>
        </div>
    );
}

export function Checkbox({ checked, onChange }) {
    return (
        <button
            onClick={onChange}
            className={`h-4 w-4 rounded border flex items-center justify-center transition-colors active:scale-95
        ${checked ? 'bg-primary-600 border-primary-600' : 'border-ink-300 dark:border-ink-600 bg-white dark:bg-ink-900'}`}
        >
            {checked && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </button>
    );
}

export function Skeleton({ className = '' }) {
    return <div className={`animate-pulse bg-ink-200 dark:bg-ink-800 rounded ${className}`} />;
}

export function EmptyState({ icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 dark:text-ink-500 mb-4">
                {icon}
            </div>
            <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-200">{title}</h3>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 max-w-sm">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

export function KpiCard({
    label,
    value,
    change,
    icon,
    trend,
    onView,
    actionText = 'View Details →',
    badgeColor = 'primary',
    className = '',
    onClick
}) {
    const badgeStyle = {
        primary: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50',
        success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50',
        warning: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50',
        error: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50',
    }[badgeColor] || 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50';

    return (
        <div
            onClick={onClick || onView}
            className={`p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 hover:scale-[1.02] flex flex-col justify-between ${
                onClick || onView ? 'cursor-pointer' : ''
            } ${className}`}
        >
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold ${badgeStyle}`}>
                        {icon}
                    </div>
                    {change && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                            trend === 'up'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                        }`}>
                            {trend === 'up' ? '↑' : '↓'} {change}
                        </span>
                    )}
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </div>

            {onView && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView();
                        }}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 active:scale-95 transition-all"
                    >
                        {actionText}
                    </button>
                </div>
            )}
        </div>
    );
}

export function ProgressBar({ value, max, color = 'primary' }) {
    const pct = Math.min(100, (value / max) * 100);
    const colorClass = color === 'warning' ? 'bg-amber-500' : color === 'error' ? 'bg-rose-500' : 'bg-primary-500';
    return (
        <div className="h-2 w-full bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
            <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
    );
}

export function Avatar({ name, size = 'md' }) {
    const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' };
    let displayName = 'User';
    if (typeof name === 'string' && name.trim()) {
        displayName = name.trim();
    } else if (name && typeof name === 'object') {
        displayName = name.username || name.name || name.full_name || 'User';
    }
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n ? n[0] : '')
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

    return (
        <div className={`${sizes[size] || sizes.md} rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center shrink-0 shadow-sm`}>
            {initials}
        </div>
    );
}

