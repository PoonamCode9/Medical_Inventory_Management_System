import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const COLORS = {
  sky: {
    gradient:  'from-sky-500/20 to-sky-600/5',
    border:    'border-sky-500/20',
    icon:      'bg-sky-500/15 border-sky-500/25 text-sky-400',
    value:     'text-sky-400',
    bar:       'bg-gradient-to-r from-sky-500 to-sky-400',
    glow:      'hover:shadow-sky-500/10',
  },
  amber: {
    gradient:  'from-amber-500/20 to-amber-600/5',
    border:    'border-amber-500/20',
    icon:      'bg-amber-500/15 border-amber-500/25 text-amber-400',
    value:     'text-amber-400',
    bar:       'bg-gradient-to-r from-amber-500 to-amber-400',
    glow:      'hover:shadow-amber-500/10',
  },
  rose: {
    gradient:  'from-rose-500/20 to-rose-600/5',
    border:    'border-rose-500/20',
    icon:      'bg-rose-500/15 border-rose-500/25 text-rose-400',
    value:     'text-rose-400',
    bar:       'bg-gradient-to-r from-rose-500 to-rose-400',
    glow:      'hover:shadow-rose-500/10',
  },
  emerald: {
    gradient:  'from-emerald-500/20 to-emerald-600/5',
    border:    'border-emerald-500/20',
    icon:      'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
    value:     'text-emerald-400',
    bar:       'bg-gradient-to-r from-emerald-500 to-emerald-400',
    glow:      'hover:shadow-emerald-500/10',
  },
  purple: {
    gradient:  'from-purple-500/20 to-purple-600/5',
    border:    'border-purple-500/20',
    icon:      'bg-purple-500/15 border-purple-500/25 text-purple-400',
    value:     'text-purple-400',
    bar:       'bg-gradient-to-r from-purple-500 to-purple-400',
    glow:      'hover:shadow-purple-500/10',
  },
};

const StatCard = ({ icon: Icon, value, label, sublabel, color = 'sky', delay = 0, trend, onClick }) => {
  const c = COLORS[color] || COLORS.sky;
  const isLoaded = value !== undefined && value !== null && value !== '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
      className={`glass-card rounded-2xl border ${c.border} shadow-lg ${c.glow} 
        hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 
        overflow-hidden relative group${onClick ? ' cursor-pointer' : ''}`}
    >
      {/* Top gradient wash */}
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${c.gradient} opacity-60 pointer-events-none`} />

      {/* Animated color bar at top */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${c.bar}`} />

      <div className="relative p-6">
        {/* Icon + trend row */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${c.icon}`}>
            <Icon className="w-5 h-5" />
          </div>

          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
              trend >= 0
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            }`}>
              <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Value */}
        <motion.div
          key={String(value)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
          className={`text-4xl font-extrabold tracking-tight mb-1 ${c.value} ${
            !isLoaded ? 'opacity-30' : ''
          }`}
        >
          {value ?? '—'}
        </motion.div>

        {/* Labels */}
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {sublabel}
          </div>
        )}
        {onClick && (
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: `var(--${color === 'amber' ? 'amber' : color === 'rose' ? 'rose' : 'sky'}-400, #38bdf8)` }}>
            <span className={c.value}>View details →</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
