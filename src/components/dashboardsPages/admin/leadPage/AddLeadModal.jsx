import React, { useState } from "react";
import api from "../../../../api/api";
import axios from "axios";
import { useAuthStore } from "../../../../store/authStore";
import { X, User, Phone, MapPin, Briefcase, FileText, ChevronDown, Loader2 } from "lucide-react";

const AddLeadModal = ({ isOpen, onClose, onSubmit }) => {
  const initialFormState = {
    name: "",
    phone: "",
    service: "",
    address: "",
    status: "Ring",
    assignedTo: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = ["Ring", "Follow Up", "Sale Done", "Not Interested", "Switch Off", "Incoming"];
  const mockUsers = [
    { _id: "65a123", name: "Amit Verma" },
    { _id: "65a124", name: "Rohit Singh" },
    { _id: "65a125", name: "Priya Sharma" },
  ];

  const { token } = useAuthStore(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(api.Leads.Create, formData, config);
      onSubmit(response.data); 
      setFormData(initialFormState);
      onClose();
    } catch (err) {
      console.error("Error creating lead:", err);
      alert("Failed to create lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden transform transition-all scale-100 ring-1 ring-slate-900/5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-md font-bold text-slate-800">Add New Lead</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quickly add a prospect to your pipeline</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400"/> Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                placeholder="Ex. Rahul Sharma"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400"/> Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" name="phone" required
                value={formData.phone} onChange={handleChange}
                placeholder="98765 43210"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Service */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400"/> Service
              </label>
              <input
                type="text" name="service"
                value={formData.service} onChange={handleChange}
                placeholder="Ex. Website Development"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <div className="relative">
                <select
                  name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-slate-400 pointer-events-none"/>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400"/> Address
              </label>
              <input
                type="text" name="address" value={formData.address} onChange={handleChange}
                placeholder="City, Area"
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Assign To */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Assign To</label>
              <div className="relative">
                <select
                  name="assignedTo" value={formData.assignedTo} onChange={handleChange}
                  className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="">Select Employee</option>
                  {mockUsers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-slate-400 pointer-events-none"/>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400"/> Remarks
              </label>
              <textarea
                name="remarks" rows="2" value={formData.remarks} onChange={handleChange}
                placeholder="Any notes..."
                className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
