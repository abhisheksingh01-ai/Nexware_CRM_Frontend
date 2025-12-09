const LeadTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "All",
    "New",
    "Follow Up",
    "Not Interested",
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeTab === tab
              ? "bg-slate-900 text-white shadow-md"
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
