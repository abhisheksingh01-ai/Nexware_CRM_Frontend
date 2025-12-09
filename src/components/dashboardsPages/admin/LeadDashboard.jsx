import { useState } from "react";
// Components
import LeadHeader from "./leadPage/LeadHeader";
import LeadStats from "./leadPage/LeadStats";
import LeadTabs from "./leadPage/LeadTabs";
import LeadSearchBar from "./leadPage/LeadSearchBar";
import LeadTable from "./leadPage/LeadTable";
import LeadGrid from "./leadPage/LeadGrid";
import LeadEmptyState from "./leadPage/LeadEmptyState";
import AddLeadModal from "./leadPage/AddLeadModal";
// Data
import { leads as initialLeads } from "./leadPage/dummyLeads";

const LeadDashboard = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddLead = (newLeadData) => {
    const newLead = {
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: { name: "Admin" },
      ...newLeadData,
    };
    setLeads([newLead, ...leads]);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.service.toLowerCase().includes(search.toLowerCase());
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
            {filteredLeads.length === 0 ? (
              <LeadEmptyState />
            ) : (
              <>
                {viewMode === "list" ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <LeadTable filteredLeads={filteredLeads} />
                    </div>
                    {/* Mobile Cards */}
                    <div className="md:hidden">
                      <LeadGrid filteredLeads={filteredLeads} />
                    </div>
                  </>
                ) : (
                  <LeadGrid filteredLeads={filteredLeads} />
                )}
              </>
            )}
          </div>

        </div>
      </main>

      {/* Modal */}
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLead}
      />
    </div>
  );
};

export default LeadDashboard;
