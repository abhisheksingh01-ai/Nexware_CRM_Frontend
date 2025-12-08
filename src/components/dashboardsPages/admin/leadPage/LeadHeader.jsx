import { Plus } from "lucide-react";

const LeadHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage your pipeline and track conversions.
        </p>
      </div>

      <button className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-slate-200">
        <Plus className="w-4 h-4" />
        Add New Lead
      </button>
    </div>
  );
};

export default LeadHeader;
