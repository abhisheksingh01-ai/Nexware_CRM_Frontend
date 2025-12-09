import { Phone, MoreHorizontal, ArrowUpRight, X } from "lucide-react";
import { getStatusColor, getStatusIcon } from "./leadUtils";
import { useAuthStore } from "../../../../store/authStore";

const LeadGrid = ({ filteredLeads, onDelete }) => {
  const { user: authUser } = useAuthStore();

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
      {filteredLeads.map((lead, index) => (
        <div
          key={lead.id || lead._id || index} // ✅ Unique key fallback
          className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                {lead.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{lead.name}</h3>
                <p className="text-xs text-slate-500">{lead.role || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {authUser?.role === "admin" && onDelete && (
                <button
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg"
                  onClick={() => onDelete(lead.id || lead._id)}
                  title="Delete Lead"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                lead.status
              )}`}
            >
              {getStatusIcon(lead.status)}
              {lead.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-400">Value</p>
              <p className="text-sm font-semibold">{lead.value || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Owner</p>
              <p className="text-sm">{lead.owner || "N/A"}</p>
            </div>
          </div>

          <div className="pt-4 flex justify-between border-t border-slate-100">
            <div className="flex gap-3">
              <a
                href={`tel:${lead.mobile || lead.phone || ""}`}
                className="p-2 hover:bg-green-50 text-slate-500 hover:text-green-600 rounded-full"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button className="p-2 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-full">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-slate-400">
              {lead.lastActivity || "N/A"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadGrid;
