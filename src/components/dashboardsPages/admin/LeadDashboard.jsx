import { useEffect, useState } from "react";
import axios from "axios";
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
  const [leads, setLeads] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
        id: lead._id,
        name: lead.name,
        phone: lead.phone || lead.mobile,
        service: lead.service,
        status: lead.status,
        createdAt: lead.createdAt,
        assignedTo: lead.assignedTo,
        createdBy: lead.createdBy,
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
  }, [authUser?.token]);

  const handleAddLead = (newLeadData) => {
    const newLead = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: { name: "Admin" },
      ...newLeadData,
    };
    setLeads([newLead, ...leads]);
  };

  const filteredLeads = leads.filter((lead) => {
    const name = lead.name || "";
    const phone = lead.phone || lead.mobile || "";
    const service = lead.service || "";

    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      service.toLowerCase().includes(search.toLowerCase());

    const matchTab = activeTab === "All" || lead.status === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <LeadHeader onAddClick={() => setIsModalOpen(true)} />

        <div className="mt-4">
          <LeadStats leads={leads} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mt-6">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-white">
            <LeadTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <LeadSearchBar
              search={search}
              setSearch={setSearch}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

          {/* Leads List/Grid */}
          <div className="bg-slate-50/50 min-h-80 p-4 md:p-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading leads...</div>
            ) : filteredLeads.length === 0 ? (
              <LeadEmptyState />
            ) : viewMode === "list" ? (
              <>
                <div className="hidden md:block">
                  <LeadTable filteredLeads={filteredLeads} />
                </div>

                <div className="md:hidden">
                  <LeadGrid filteredLeads={filteredLeads} />
                </div>
              </>
            ) : (
              <LeadGrid filteredLeads={filteredLeads} />
            )}
          </div>
        </div>
      </main>

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLead}
      />
    </div>
  );
};

export default LeadDashboard;
