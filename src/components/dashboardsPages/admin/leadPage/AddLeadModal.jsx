// components/lead/AddLeadModal.jsx
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
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

      // alert("Lead created successfully"); // Optional: Use a toast instead
      onSubmit?.(res.data?.data || res.data);

      // Reset Form
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

  // -------------------- ANIMATION VARIANTS --------------------
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.95, y: 10 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Add New Lead
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Fill in the details to create a new prospect.
                </p>
              </div>
              <button
                onClick={onClose}
                className="group p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="overflow-y-auto custom-scrollbar p-6">
              <form id="add-lead-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section: Primary Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Full Name" 
                    name="name" 
                    value={lead.name} 
                    onChange={handleChange} 
                    required 
                    icon={User} 
                    placeholder="e.g. John Doe" 
                  />
                  
                  <InputField 
                    label="Phone Number" 
                    name="phone" 
                    value={lead.phone} 
                    onChange={handleChange} 
                    required 
                    icon={Phone} 
                    placeholder="e.g. +91 98765 43210" 
                  />
                </div>

                {/* Section: Service & Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Service Interest" 
                    name="service" 
                    value={lead.service} 
                    onChange={handleChange} 
                    icon={Briefcase} 
                    placeholder="e.g. Web Development" 
                  />
                  
                  <InputField 
                    label="Lead Source" 
                    name="source" 
                    value={lead.source} 
                    onChange={handleChange} 
                    icon={FileText} 
                    placeholder="e.g. LinkedIn Campaign" 
                  />
                </div>

                {/* Section: Location & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Address / Location" 
                    name="address" 
                    value={lead.address} 
                    onChange={handleChange} 
                    icon={MapPin} 
                    placeholder="e.g. Mumbai, India" 
                  />

                  {/* Custom Select for Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={lead.status}
                        onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer hover:bg-slate-100"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Section: Assignment & Remarks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                      Assign To
                    </label>
                    <div className="relative">
                      <select
                        name="assignedTo"
                        value={lead.assignedTo}
                        onChange={handleChange}
                         className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer hover:bg-slate-100"
                      >
                        <option value="">Select Team Member</option>
                        {users.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                      <User className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Remarks Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    rows="3"
                    value={lead.remarks}
                    onChange={handleChange}
                    placeholder="Add any additional notes here..."
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none placeholder:text-slate-400"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-lead-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Create Lead"
                )}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Helper Component for consistent inputs
const InputField = ({ label, icon: Icon, required, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all group-hover:bg-slate-100 group-hover:focus:bg-white"
      />
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      )}
    </div>
  </div>
);

export default AddLeadModal;