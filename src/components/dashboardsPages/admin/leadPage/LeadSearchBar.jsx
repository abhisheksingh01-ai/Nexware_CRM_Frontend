// components/lead/LeadSearchBar.jsx
import { Search, LayoutGrid, List } from "lucide-react";

const LeadSearchBar = ({ search, setSearch, viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button
          onClick={() => setViewMode("list")}
          className={`p-1.5 rounded ${
            viewMode === "list"
              ? "bg-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`p-1.5 rounded ${
            viewMode === "grid"
              ? "bg-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LeadSearchBar;
