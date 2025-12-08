// components/lead/LeadEmptyState.jsx
import { Search } from "lucide-react";

const LeadEmptyState = () => {
  return (
    <div className="p-12 text-center">
      <div className="inline-block p-4 rounded-full bg-slate-50 mb-4">
        <Search className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-slate-900 font-medium">No leads found</h3>
      <p className="text-slate-500 text-sm mt-1">
        Try changing your filters or add a new lead.
      </p>
    </div>
  );
};

export default LeadEmptyState;
