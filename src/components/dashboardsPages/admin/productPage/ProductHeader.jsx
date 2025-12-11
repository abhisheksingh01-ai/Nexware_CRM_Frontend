import React from "react";
import { Plus, Sparkles, Package } from "lucide-react";
const ProductHeader = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
      <div className="">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600 opacity-80" />
          Product Inventory
        </h1>
        
        <p className="text-slate-500 text-sm max-w-lg leading-relaxed mt-1">
          Manage your entire catalog. Track stock levels, update pricing, 
          adjust SKU details, and organize product categories efficiently.
        </p>
      </div>
      
      <button
        onClick={onAddClick}
        className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 bg-slate-900 rounded-xl hover:bg-slate-800 hover:scale-[1.02] shadow-lg shadow-slate-900/20 ring-offset-2 focus:ring-2 focus:ring-slate-900"
      >
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-slate-800 rounded-lg p-1 group-hover:bg-slate-700 transition-colors border border-slate-700">
          <Plus className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
        </div>
        
        <span className="relative">Add New Product</span>
        <Sparkles className="w-4 h-4 text-emerald-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </button>
    </div>
  );
};

export default ProductHeader;