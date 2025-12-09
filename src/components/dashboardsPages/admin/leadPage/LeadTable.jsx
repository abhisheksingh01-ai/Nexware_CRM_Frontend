import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../api/api";
import {
  MoreHorizontal,
  X,
  User,
  Phone,
  MapPin,
  Tag,
  Briefcase,
  Edit3,
  Clock,
  Mail,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../../../../store/authStore";
import { getStatusColor, getStatusIcon } from "./leadUtils";

// --- HELPER COMPONENT: INFO CARD ---
const InfoCard = ({ icon: Icon, iconColor, label, value, subValue }) => (
  <div className="flex items-start p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
    <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10 shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor.replace("bg-", "text-")}`} />
    </div>
    <div className="ml-3 overflow-hidden">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 truncate">
        {value || "N/A"}
      </p>
      {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
    </div>
  </div>
);

// --- COMPONENT: POPUP DETAILS ---
const LeadDetailsPopup = ({
  leadId,
  onClose,
  token,
  isUserAdmin,
  onSuccess,
}) => {
  const [leadDetails, setLeadDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(api.Leads.GetDetails(leadId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        setLeadDetails(res.data.data);
      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetails();
  }, [leadId, token]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${leadDetails?.name}?`
      )
    ) {
      return;
    }

    try {
      if (!token) {
        alert("Token missing!");
        return;
      }

      setActionLoading(true);

      // --- FIX APPLIED HERE ---
      // Axios DELETE accepts config as the 2nd argument.
      // Data must be inside the 'data' key.
      await axios.delete(api.Leads.AdminDelete, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { leadId: leadId }, // Body goes here for DELETE requests
      });

      // Refresh the table
      if (onSuccess) onSuccess();

      onClose(); // Close the popup
    } catch (err) {
      console.error("Failed to delete lead:", err);
      alert("Error deleting lead");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = () => {
    console.log("Update clicked for:", leadId);
    // Add your update logic here
  };

  if (!leadId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Lead Details
              {leadDetails && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusColor(
                    leadDetails.status
                  )}`}
                >
                  {leadDetails.status}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              ID: <span className="font-mono">{leadId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-white custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-gray-500">Retrieving data...</p>
            </div>
          ) : (
            leadDetails && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      icon={User}
                      iconColor="bg-blue-100 text-blue-600"
                      label="Full Name"
                      value={leadDetails.name}
                    />
                    <InfoCard
                      icon={Phone}
                      iconColor="bg-green-100 text-green-600"
                      label="Mobile Number"
                      value={leadDetails.mobile}
                    />
                    <InfoCard
                      icon={MapPin}
                      iconColor="bg-red-100 text-red-600"
                      label="Address"
                      value={leadDetails.address}
                    />
                    <InfoCard
                      icon={Mail}
                      iconColor="bg-purple-100 text-purple-600"
                      label="Email"
                      value={leadDetails.email || "No email provided"}
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
                    Project Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      icon={Briefcase}
                      iconColor="bg-orange-100 text-orange-600"
                      label="Service Required"
                      value={leadDetails.service}
                    />
                    <InfoCard
                      icon={Tag}
                      iconColor="bg-indigo-100 text-indigo-600"
                      label="Source"
                      value={leadDetails.source}
                    />

                    <InfoCard
                      icon={User}
                      iconColor="bg-teal-100 text-teal-600"
                      label="Assigned To"
                      value={leadDetails.assignedTo?.name}
                      subValue={leadDetails.assignedTo?.email}
                    />
                    <InfoCard
                      icon={Clock}
                      iconColor="bg-gray-100 text-gray-600"
                      label="Created At"
                      value={new Date(
                        leadDetails.createdAt
                      ).toLocaleDateString()}
                      subValue={new Date(
                        leadDetails.createdAt
                      ).toLocaleTimeString()}
                    />

                    <InfoCard
                      icon={Clock}
                      iconColor="bg-blue-100 text-blue-600"
                      label="Last Updated"
                      value={new Date(
                        leadDetails.updatedAt
                      ).toLocaleDateString()}
                      subValue={new Date(
                        leadDetails.updatedAt
                      ).toLocaleTimeString()}
                    />
                  </div>
                </div>

                {/* Remarks */}
                {leadDetails.remarks && (
                  <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-yellow-700 uppercase mb-2 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1.5" />
                      Remarks
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {leadDetails.remarks}
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {/* Left: Admin Only Delete */}
          <div>
            {isUserAdmin && (
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right: Standard Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Close
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading || actionLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: LEAD TABLE ---
const LeadTable = () => {
  const { user: authUser } = useAuthStore();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  // Check Role: Assumes backend sends 'admin' (lowercase)
  const isAdmin = authUser?.role === "admin";

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = authUser?.token;
      if (!token) return;
      const res = await axios.get(api.Leads.GetAll, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || [];
      const mappedLeads = data.map((lead, index) => ({
        id: lead.id || lead._id || `lead-${index}`,
        name: lead.name || "Unknown",
        mobile: lead.mobile || lead.phone || "N/A",
        status: lead.status || "Pending",
        date:
          lead.date || lead.createdAt
            ? new Date(lead.date || lead.createdAt).toISOString().split("T")[0]
            : "N/A",
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

  // Use this if you add a delete button directly to the row
  const handleDeleteRow = async (e, id) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      const token = authUser?.token;
      if (!token) {
        alert("Token missing!");
        return;
      }

      // --- FIX APPLIED HERE ALSO ---
      await axios.delete(api.Leads.AdminDelete, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { leadId: id }, // Body goes here
      });

      // Refresh the table list immediately after deleting
      fetchLeads();
    } catch (err) {
      console.error("Failed to delete lead:", err);
      alert("Error deleting lead");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const displayedLeads = showAll ? leads : leads.slice(0, 4);

  return (
    <div className="w-full space-y-4">
      <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Mobile</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {displayedLeads.map((lead, index) => (
              <tr
                key={lead.id}
                className="hover:bg-slate-50/80 transition-all duration-200 group"
              >
                <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {lead.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono tracking-tight">
                  {lead.mobile}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {getStatusIcon(lead.status)}
                    <span className="ml-1.5">{lead.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{lead.date}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    className="text-gray-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-lg transition-all"
                    onClick={() => setSelectedLeadId(lead.id)}
                    title="View Details"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leads.length > 4 && !showAll && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-all"
          >
            Show All ({leads.length})
          </button>
        </div>
      )}

      {/* Render Popup */}
      {selectedLeadId && (
        <LeadDetailsPopup
          leadId={selectedLeadId}
          token={authUser?.token}
          isUserAdmin={isAdmin}
          onClose={() => setSelectedLeadId(null)}
          onSuccess={fetchLeads}
        />
      )}
    </div>
  );
};

export default LeadTable;
