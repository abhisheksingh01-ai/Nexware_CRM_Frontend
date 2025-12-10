// components/lead/LeadDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// Components
import LeadHeader from "./leadPage/LeadHeader";
import LeadStats from "./leadPage/LeadStats";
import LeadTabs from "./leadPage/LeadTabs";
import LeadSearchBar from "./leadPage/LeadSearchBar";
import LeadTable from "./leadPage/LeadTable";
import LeadGrid from "./leadPage/LeadGrid";
import LeadEmptyState from "./leadPage/LeadEmptyState";
import AddLeadModal from "./leadPage/AddLeadModal";

import api from "../../../api/api";
import { useAuthStore } from "../../../store/authStore";

const LeadDashboard = () => {
  const { user: authUser } = useAuthStore();
  
  // --- State ---
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. Fetch Data ---
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
        _id: lead._id,
        name: lead.name || "Unknown",
        phone: lead.phone || lead.mobile || "",
        service: lead.service || "General",
        status: lead.status || "Incoming",
        source: lead.source || "Unknown",
        address: lead.address || "",
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        assignedTo: lead.assignedTo,
      }));

      setLeads(mappedLeads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [authUser?.token]);

  // --- 2. Handlers ---
  const handleAddLead = (newLeadData) => {
    const newLead = {
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "Ring", 
      ...newLeadData,
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleDeleteLead = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeads((prev) => prev.filter((l) => l._id !== id));
      // TODO: Add API Delete Call Here
    }
  };

  // --- 3. Filter & Counts ---
  const filteredLeads = useMemo(() => {
    const term = search.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesSearch = 
        (lead.name?.toLowerCase() || "").includes(term) ||
        (lead.phone?.toString() || "").includes(term) ||
        (lead.service?.toLowerCase() || "").includes(term);
      const matchesTab = activeTab === "All" || lead.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [leads, search, activeTab]);

  const counts = useMemo(() => {
    const stats = { "All": leads.length };
    leads.forEach(lead => {
      stats[lead.status] = (stats[lead.status] || 0) + 1;
    });
    return stats;
  }, [leads]);

  // --- 4. Render ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        <LeadHeader onAddClick={() => setIsModalOpen(true)} />

        <div className="mt-6">
          <LeadStats leads={leads} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
          
          {/* CONTROL BAR LAYOUT (2/3 Tabs, 1/3 Search) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b border-slate-100 bg-white/50 backdrop-blur-xl items-center">
            <div className="min-w-0 w-full overflow-hidden md:col-span-2">
               <LeadTabs 
                 activeTab={activeTab} 
                 setActiveTab={setActiveTab} 
                 counts={counts} 
               />
            </div>
            <div className="min-w-0 w-full">
              <LeadSearchBar
                search={search}
                setSearch={setSearch}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-slate-50/30 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                <p>Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8">
                {/* --- CRITICAL UPDATE HERE: Passing the handler --- */}
                <LeadEmptyState onAddClick={() => setIsModalOpen(true)} />
                {/* -------------------------------------------------- */}
              </div>
            ) : (
              <div className="p-4">
                <div className="hidden md:block">
                  {viewMode === "list" ? (
                    <LeadTable 
                      filteredLeads={filteredLeads} 
                      onDelete={handleDeleteLead} 
                    />
                  ) : (
                    <LeadGrid 
                      filteredLeads={filteredLeads} 
                      onDelete={handleDeleteLead} 
                    />
                  )}
                </div>
                <div className="md:hidden">
                  <LeadGrid 
                    filteredLeads={filteredLeads} 
                    onDelete={handleDeleteLead} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <AddLeadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddLead}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadDashboard;