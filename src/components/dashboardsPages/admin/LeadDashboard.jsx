import { useState } from "react";
import LeadHeader from "./leadPage/LeadHeader";
import LeadStats from "./leadPage/LeadStats";
import LeadTabs from "./leadPage/LeadTabs";
import LeadSearchBar from "./leadPage/LeadSearchBar";
import LeadTable from "./leadPage/LeadTable";
import LeadGrid from "./leadPage/LeadGrid";
import LeadEmptyState from "./leadPage/LeadEmptyState";
import { leads } from "./leadPage/dummyLeads";

const LeadDashboard = () => {
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.service.toLowerCase().includes(search.toLowerCase());

    const matchTab = activeTab === "All" || lead.status === activeTab;

    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-7xl mx-auto px-4 py-2">
        <LeadHeader />
        <LeadStats />

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-2">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
            <LeadTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <LeadSearchBar
              search={search}
              setSearch={setSearch}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

          {filteredLeads.length === 0 ? (
            <LeadEmptyState />
          ) : (
            <>
              {viewMode === "list" && (
                <LeadTable filteredLeads={filteredLeads} />
              )}
              <LeadGrid filteredLeads={filteredLeads} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeadDashboard;
