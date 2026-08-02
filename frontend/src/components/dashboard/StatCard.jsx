import React from "react";

function StatCard({ 
  title, 
  value, 
  icon, 
  iconBg = "bg-blue-100", 
  cardBg = "from-blue-50/60 to-white", 
  borderColor = "border-blue-200" 
}) {
  return (
    <div className={`bg-gradient-to-br ${cardBg} border ${borderColor} rounded-2xl p-5 shadow-2xs hover:shadow-md transition duration-200 flex items-center justify-between`}>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-xl ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}

export default StatCard;