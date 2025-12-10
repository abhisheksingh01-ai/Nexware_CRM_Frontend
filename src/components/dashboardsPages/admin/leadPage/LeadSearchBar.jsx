// components/lead/LeadSearchBar.jsx
import React from "react";
import { Search, LayoutGrid, List, X } from "lucide-react";

const LeadSearchBar = ({ search, setSearch, viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      
      {/* 1. Search Input Wrapper (Flex-1 makes it take all remaining space) */}
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
        
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
                     hover:border-slate-300 transition-all shadow-sm"
        />

        {/* Clear 'X' Button - Only shows when typing */}
        {search.length > 0 && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 2. View Toggle Buttons (Hidden on Mobile) */}
      <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
        <button
          onClick={() => setViewMode("list")}
          title="List View"
          className={`p-1.5 rounded-md transition-all ${
            viewMode === "list"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          title="Grid View"
          className={`p-1.5 rounded-md transition-all ${
            viewMode === "grid"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LeadSearchBar;