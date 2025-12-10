// components/lead/LeadHeader.jsx
import React from "react";
import { Plus, Sparkles} from "lucide-react";

const LeadHeader = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
      <div className="">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Leads Overview
        </h1>
        
        <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
          Manage your sales pipeline. Track incoming leads, assign tasks, 
          and monitor your conversion rates in real-time.
        </p>
      </div>

      {/* Right Side: Primary Action Button */}
      <button
        onClick={onAddClick}
        className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 bg-slate-900 rounded-xl hover:bg-slate-800 hover:scale-[1.02] shadow-lg shadow-slate-900/20 ring-offset-2 focus:ring-2 focus:ring-slate-900"
      >
        {/* Button Glow Effect (Visible on Hover) */}
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Icon Container */}
        <div className="relative bg-slate-800 rounded-lg p-1 group-hover:bg-slate-700 transition-colors border border-slate-700">
          <Plus className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
        </div>
        
        <span className="relative">Add New Lead</span>
        
        {/* Sparkle Icon Animation */}
        <Sparkles className="w-4 h-4 text-yellow-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </button>
    </div>
  );
};

export default LeadHeader;