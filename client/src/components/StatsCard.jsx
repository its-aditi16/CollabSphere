import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, trend, subValue }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl hover:border-indigo-500/30 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-800 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
