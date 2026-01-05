
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, trend }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-red-500/50 transition-colors shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</span>
        {icon && <div className="text-red-500">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold mono tracking-tight">{value}</h3>
        {trend && (
          <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•'}
          </span>
        )}
      </div>
      {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
    </div>
  );
};

export default StatCard;
