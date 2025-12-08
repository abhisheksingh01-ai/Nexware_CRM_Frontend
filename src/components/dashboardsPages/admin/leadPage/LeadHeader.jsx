import React from "react";
import { Plus } from "lucide-react";

const LeadHeader = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Leads Overview
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-md">
          Manage your pipeline. Track incoming leads, assign tasks, and monitor conversions effectively.
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="group inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-xl shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-0.5"
      >
        <div className="bg-slate-700 rounded-md p-0.5 transition-colors group-hover:bg-slate-600">
          <Plus className="w-4 h-4" />
        </div>
        Add New Lead
      </button>
    </div>
  );
};

export default LeadHeader;