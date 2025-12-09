import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../api/api";
import { useAuthStore } from "../../../../store/authStore";
import {
  X,
  User,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  ChevronDown,
  Loader2,
} from "lucide-react";

const AddLeadModal = ({ isOpen, onClose, onSubmit }) => {
  const { user: authUser } = useAuthStore();
  const [users, setUsers] = useState([]);

  const [lead, setLead] = useState({
    name: "",
    phone: "",
    service: "",
    address: "",
    source: "",
    status: "Ring",
    assignedTo: "",
    remarks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    "Ring",
    "Follow Up",
    "Sale Done",
    "Not Interested",
    "Switch Off",
    "Incoming",
  ];

  // -------------------- FETCH USERS --------------------
  const fetchUsers = async () => {
    try {
      const token = authUser?.token;
      if (!token) return;

      const res = await axios.get(api.User.AdminGetAll, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("User fetch error:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    if (isOpen) fetchUsers();
  }, [isOpen]);

  // -------------------- HANDLE INPUT CHANGE --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------- SUBMIT LEAD --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const token = authUser?.token;
      if (!token) return alert("Unauthorized!");

      const body = {
        name: lead.name.trim(),
        phone: lead.phone.trim(),
        service: lead.service.trim(),
        address: lead.address.trim() || undefined,
        source: lead.source.trim() || undefined,
        status: lead.status,
        remarks: lead.remarks.trim() || undefined,
        assignedTo: lead.assignedTo || undefined,
      };

      const res = await axios.post(api.Leads.Create, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Lead created successfully");
      onSubmit?.(res.data?.data || res.data);

      setLead({
        name: "",
        phone: "",
        service: "",
        address: "",
        source: "",
        status: "Ring",
        assignedTo: "",
        remarks: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.errors?.join(", ") || err.response?.data?.message;
      alert(msg || "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-md font-bold text-slate-800">Add New Lead</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quickly add a prospect to your pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={lead.name}
                onChange={handleChange}
                placeholder="Ex. Rahul Sharma"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> Phone{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={lead.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Service */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" /> Service
              </label>
              <input
                type="text"
                name="service"
                value={lead.service}
                onChange={handleChange}
                placeholder="Ex. Website Development"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Source */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" /> Source
              </label>
              <input
                type="text"
                name="source"
                value={lead.source}
                onChange={handleChange}
                placeholder="Ex. LinkedIn, Email"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={lead.status}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Address
              </label>
              <input
                type="text"
                name="address"
                value={lead.address}
                onChange={handleChange}
                placeholder="City, Area"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Assign To */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Assign To</label>
              <div className="relative">
                <select
                  name="assignedTo"
                  value={lead.assignedTo}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select Employee</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" /> Remarks
              </label>
              <textarea
                name="remarks"
                rows="2"
                value={lead.remarks}
                onChange={handleChange}
                placeholder="Any notes..."
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
