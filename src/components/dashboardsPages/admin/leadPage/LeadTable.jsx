// components/lead/LeadTable.jsx

import { MoreHorizontal } from "lucide-react";
import { getStatusColor, getStatusIcon } from "./leadUtils";

const LeadTable = ({ filteredLeads }) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <th className="px-6 py-4">Lead Name</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Value</th>
            <th className="px-6 py-4">Owner</th>
            <th className="px-6 py-4">Last Activity</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {filteredLeads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {lead.name}
                    </p>
                    <p className="text-xs text-slate-500">{lead.service}</p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {getStatusIcon(lead.status)}
                  {lead.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700">
                  {lead.value}
                </p>
              </td>

              <td className="px-6 py-4">
                <p className="text-sm text-slate-700">{lead.owner}</p>
              </td>

              <td className="px-6 py-4">
                <p className="text-sm text-slate-500">{lead.lastActivity}</p>
              </td>

              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
