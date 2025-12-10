// components/lead/LeadGrid.jsx
import React, { useState, useEffect } from "react";
import {
  Phone,
  MoreHorizontal,
  ArrowUpRight,
  MapPin,
  Trash2,
  Edit,
} from "lucide-react";
import { getStatusColor, getStatusIcon } from "./leadUtils";
import { useAuthStore } from "../../../../store/authStore";

const LeadGrid = ({ filteredLeads, onDelete }) => {
  const { user: authUser } = useAuthStore();

  // State to track which card's menu is open (by ID)
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close menu when clicking anywhere else on the page
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredLeads.map((lead, index) => (
        <div
          key={lead._id || `lead-${index}`} // ✅ FIXED UNIQUE KEY
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative group"
        >
          {/* --- Header: Avatar & Name --- */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar Circle */}
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 text-sm">
                {lead.name?.charAt(0).toUpperCase()}
              </div>

              {/* Name & Service */}
              <div className="overflow-hidden">
                <h3
                  className="font-semibold text-slate-900 truncate max-w-[140px]"
                  title={lead.name}
                >
                  {lead.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {lead.service || "General"}
                </p>
              </div>
            </div>

            {/* --- Action Menu (Three Dots) --- */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent 'click outside' from firing immediately
                  setOpenMenuId(openMenuId === lead._id ? null : lead._id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  openMenuId === lead._id
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {openMenuId === lead._id && (
                <div
                  className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>

                    {/* Only Admin can delete */}
                    {authUser?.role === "admin" && (
                      <button
                        onClick={() => {
                          onDelete(lead._id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- Status Badge & Address --- */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                lead.status
              )}`}
            >
              {getStatusIcon(lead.status)}
              <span className="ml-1.5">{lead.status}</span>
            </span>

            {lead.address && (
              <span
                className="text-[11px] text-slate-400 flex items-center gap-1 max-w-[100px] truncate"
                title={lead.address}
              >
                <MapPin className="w-3 h-3" /> {lead.address}
              </span>
            )}
          </div>

          {/* --- Info Data Grid --- */}
          <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-slate-50 rounded-lg border border-slate-100/50">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                Source
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {lead.source}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                Assigned To
              </p>
              <p className="text-sm font-medium text-slate-700 truncate">
                {lead.assignedTo?.name || "Unassigned"}
              </p>
            </div>
          </div>

          {/* --- Footer Buttons --- */}
          <div className="pt-3 flex justify-between items-center border-t border-slate-100">
            <div className="flex gap-2">
              <a
                href={`tel:${lead.phone}`}
                className="p-2 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-full transition-colors shadow-sm"
                title="Call Lead"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-full transition-colors shadow-sm"
                title="View Details"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              {new Date(lead.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadGrid;
