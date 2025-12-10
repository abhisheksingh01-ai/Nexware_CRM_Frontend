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
  Clock,
  Mail,
  CheckCircle2,
  Trash2,
  Save
} from "lucide-react";
import { useAuthStore } from "../../../../store/authStore";
import { getStatusColor, getStatusIcon } from "./leadUtils";

// --- HELPER COMPONENT: INFO CARD ---
const InfoCard = ({ 
  icon: Icon, 
  iconColor, 
  label, 
  value, 
  subValue, 
  isEditable, 
  name, 
  onChange, 
  type = "text", 
  options 
}) => (
  <div className="flex items-start p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
    <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10 shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor.replace("bg-", "text-")}`} />
    </div>
    <div className="ml-3 overflow-hidden w-full">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      
      {isEditable ? (
        type === "select" ? (
           <select
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="" disabled>Select Option</option>
            {options && options.map((opt, index) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={`${optValue}-${index}`} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>
        ) : (
          <input 
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full mt-1 p-1 bg-white border-b border-gray-300 focus:border-blue-500 text-sm font-semibold text-gray-900 focus:outline-none"
          />
        )
      ) : (
        <p className="text-sm font-semibold text-gray-900 truncate">
          {value || "N/A"}
        </p>
      )}

      {subValue && !isEditable && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
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
  const [formData, setFormData] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [assignees, setAssignees] = useState([]); 

  // UPDATED: Must match Joi schema .valid() list exactly
  const statusOptions = [
    "Ring", 
    "Follow Up", 
    "Sale Done", 
    "Not Interested", 
    "Switch Off", 
    "Incoming"
  ];

  // Combined Fetch Effect
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Lead Details
        const res = await axios.get(api.Leads.GetDetails(leadId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setLeadDetails(data);

        // Pre-fill form
        setFormData({
          name: data.name || "",
          mobile: data.mobile || data.phone || "", 
          address: data.address || "",
          service: data.service || "",
          source: data.source || "",
          // Ensure default status is valid, or fallback to first option
          status: statusOptions.includes(data.status) ? data.status : "Ring",
          assignedTo: typeof data.assignedTo === 'object' ? data.assignedTo?._id : data.assignedTo || "",
          remarks: data.remarks || ""
        });

        // 2. Fetch Users
        try {
          const url = api.User?.AdminGetAll; 
          if (url) {
            const userRes = await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const rawUsers = Array.isArray(userRes.data) ? userRes.data : (userRes.data?.data || []);
            const userOptions = rawUsers.map(u => ({
              label: u.name,
              value: u._id
            }));
            setAssignees(userOptions);
          }
        } catch (userErr) {
          console.error("User fetch error:", userErr);
        }

      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (leadId && token) {
      initData();
    }
  }, [leadId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ${leadDetails?.name}?`)) return;

    try {
      if (!token) { alert("Token missing!"); return; }
      setActionLoading(true);
      await axios.delete(api.Leads.AdminDelete, {
        headers: { Authorization: `Bearer ${token}` },
        data: { leadId: leadId }, 
      });
      if (onSuccess) onSuccess();
      onClose(); 
    } catch (err) {
      console.error("Failed to delete lead:", err);
      alert("Error deleting lead");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!token) { alert("Token missing!"); return; }
      setActionLoading(true);

      // --- CRITICAL FIX: EXACT SCHEMA MATCH ---
      // Your Joi schema has .unknown(false), so we must ONLY send defined fields.
      
      const payload = {
        id: leadId,              
        name: formData.name,
        phone: formData.mobile, // Frontend uses 'mobile', Backend Joi expects 'phone'
        service: formData.service,
        address: formData.address,
        source: formData.source,
        status: formData.status,
        remarks: formData.remarks
      };

      // Only add assignedTo if it is a valid string (Joi optional string)
      if (formData.assignedTo && formData.assignedTo.trim() !== "") {
        payload.assignedTo = formData.assignedTo;
      }

      console.log("Sending Strict Payload:", payload);

      await axios.put(api.Leads.Update, payload, {
          headers: { Authorization: `Bearer ${token}` }
      });

      if (onSuccess) onSuccess();
      onClose();

    } catch (error) {
      console.error("Update Error:", error);
      
      // --- FIX: READ BACKEND ERROR ARRAY ---
      // Your backend returns { success: false, errors: [...] }
      const resData = error.response?.data;
      let errorMsg = "Update failed";

      if (resData?.errors && Array.isArray(resData.errors)) {
        // Backend returned Joi validation array
        errorMsg = resData.errors.join(", ");
      } else if (resData?.message) {
        // Backend returned generic message
        errorMsg = resData.message;
      } else {
        errorMsg = error.message;
      }

      alert(`Failed: ${errorMsg}`);
      
    } finally {
      setActionLoading(false);
    }
  };


  if (!leadId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Edit Lead Details
              {leadDetails && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusColor(formData.status)}`}>
                  {formData.status}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              ID: <span className="font-mono">{leadId}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
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
                    <InfoCard icon={User} iconColor="bg-blue-100 text-blue-600" label="Full Name" isEditable={true} name="name" value={formData.name} onChange={handleChange} />
                    {/* Maps to phone in payload */}
                    <InfoCard icon={Phone} iconColor="bg-green-100 text-green-600" label="Mobile Number" isEditable={true} name="mobile" value={formData.mobile} onChange={handleChange} />
                    <InfoCard icon={MapPin} iconColor="bg-red-100 text-red-600" label="Address" isEditable={true} name="address" value={formData.address} onChange={handleChange} />
                    <InfoCard icon={Mail} iconColor="bg-purple-100 text-purple-600" label="Email" value={leadDetails.email || "No email provided"} />
                  </div>
                </div>

                {/* Project Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
                    Project Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard icon={Briefcase} iconColor="bg-orange-100 text-orange-600" label="Service Required" isEditable={true} name="service" value={formData.service} onChange={handleChange} />
                    <InfoCard icon={Tag} iconColor="bg-indigo-100 text-indigo-600" label="Source" isEditable={true} name="source" value={formData.source} onChange={handleChange} />
                    
                    <InfoCard
                      icon={User} 
                      iconColor="bg-teal-100 text-teal-600"
                      label="Assigned To"
                      isEditable={true} 
                      name="assignedTo" 
                      value={formData.assignedTo} 
                      onChange={handleChange}
                      type="select" 
                      options={assignees} 
                    />

                    {/* Uses strict status options */}
                    <InfoCard icon={CheckCircle2} iconColor="bg-blue-100 text-blue-600" label="Status" isEditable={true} type="select" options={statusOptions} name="status" value={formData.status} onChange={handleChange} />
                    
                    <InfoCard icon={Clock} iconColor="bg-gray-100 text-gray-600" label="Created At" value={new Date(leadDetails.createdAt).toLocaleDateString()} subValue={new Date(leadDetails.createdAt).toLocaleTimeString()} />
                    <InfoCard icon={Clock} iconColor="bg-gray-100 text-gray-600" label="Last Updated" value={new Date(leadDetails.updatedAt).toLocaleDateString()} subValue={new Date(leadDetails.updatedAt).toLocaleTimeString()} />
                  </div>
                </div>

                {/* Remarks */}
                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-yellow-700 uppercase mb-2 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1.5" />
                      Remarks
                    </h4>
                    <textarea 
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-yellow-200 text-sm text-gray-700 leading-relaxed focus:outline-none focus:border-yellow-500 min-h-[60px]"
                        placeholder="Enter remarks..."
                    />
                </div>

              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            {isUserAdmin && (
              <button onClick={handleDelete} disabled={actionLoading} className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all flex items-center gap-2 disabled:opacity-50">
                {actionLoading ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete</>}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button onClick={handleUpdate} disabled={loading || actionLoading} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all transform active:scale-95">
              {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" /> }
              Save Changes
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
        mobile: lead.phone || lead.mobile || "N/A",
        status: lead.status || "Pending",
        date: lead.date || lead.createdAt ? new Date(lead.date || lead.createdAt).toISOString().split("T")[0] : "N/A",
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

  if (loading) return <div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>;

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
              <tr key={lead.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                <td className="px-6 py-4 text-sm text-gray-400 font-medium">{index + 1}</td>
                <td className="px-6 py-4"><div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{lead.name}</div></td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono tracking-tight">{lead.mobile}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(lead.status)}`}>
                    {getStatusIcon(lead.status)}
                    <span className="ml-1.5">{lead.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{lead.date}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="text-gray-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-lg transition-all" onClick={() => setSelectedLeadId(lead.id)} title="View Details">
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
          <button onClick={() => setShowAll(true)} className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-all">
            Show All ({leads.length})
          </button>
        </div>
      )}
      {selectedLeadId && <LeadDetailsPopup leadId={selectedLeadId} token={authUser?.token} isUserAdmin={isAdmin} onClose={() => setSelectedLeadId(null)} onSuccess={fetchLeads} />}
    </div>
  );
};

export default LeadTable;