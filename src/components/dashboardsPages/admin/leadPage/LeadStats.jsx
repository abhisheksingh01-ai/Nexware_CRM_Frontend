// components/lead/LeadStats.jsx

const LeadStats = () => {
  const stats = [
    { label: "Total Leads", val: "124", change: "+12%" },
    { label: "Conversion Rate", val: "8.2%", change: "+2.1%" },
    { label: "Pipeline Value", val: "₹12.4L", change: "+5%" },
    { label: "Pending Tasks", val: "14", change: "-2" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {stat.label}
          </p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{stat.val}</h3>
            <span
              className={`text-xs font-medium ${
                stat.change.startsWith("+")
                  ? "text-emerald-600"
                  : "text-red-500"
              } bg-slate-50 px-1.5 py-0.5 rounded`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadStats;
