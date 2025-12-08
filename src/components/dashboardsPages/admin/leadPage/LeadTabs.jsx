// components/lead/LeadTabs.jsx

const LeadTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "New", "Follow Up", "Won", "Lost"];

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default LeadTabs;
