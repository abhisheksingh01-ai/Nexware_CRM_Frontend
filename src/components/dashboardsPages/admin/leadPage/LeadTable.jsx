import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../api/api";
import { MoreHorizontal } from "lucide-react";
import { useAuthStore } from "../../../../store/authStore";
import { getStatusColor, getStatusIcon } from "./leadUtils";


const LeadTable = () => {
  const { user: authUser } = useAuthStore();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = authUser?.token;
      if (!token) return;

      const res = await axios.get(api.Leads.GetAll, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data || [];
      const mappedLeads = data.map((lead) => ({
        id: lead.id || lead._id,
        name: lead.name,
        mobile: lead.mobile || lead.phone,
        status: lead.status,
        date: new Date(lead.date || lead.createdAt).toISOString().split("T")[0],
      }));

      setLeads(mappedLeads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4 text-slate-500">Loading leads...</div>
    );
  }

  const displayedLeads = showAll ? leads : leads.slice(0, 4);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 font-semibold">
            <th className="px-6 py-3 text-left">#</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Mobile</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {displayedLeads.map((lead, index) => (
            <tr
              key={lead.id}
              className={`transition-colors hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                {lead.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{lead.mobile}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {getStatusIcon(lead.status)}
                  <span className="ml-1">{lead.status}</span>
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-800">
                  {lead.date}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {leads.length > 4 && !showAll && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
