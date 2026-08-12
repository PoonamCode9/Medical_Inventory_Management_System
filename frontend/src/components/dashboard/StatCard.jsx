import React from "react";

function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-100",
  cardBg = "from-blue-50/40 to-white",
  borderColor = "border-slate-200/80",
}) {
  return (
    <div
      className={`bg-gradient-to-br ${cardBg} border ${borderColor} rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between`}
    >
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>
      <div
        className={`p-2.5 rounded-xl border border-white/60 shadow-2xs ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;