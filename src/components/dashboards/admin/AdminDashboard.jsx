import React from "react";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// KPI Data
const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    positive: true,
    icon: DollarSign,
    color: "indigo",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    positive: true,
    icon: Users,
    color: "blue",
  },
  {
    title: "New Orders",
    value: "+12,234",
    change: "-4.5%",
    positive: false,
    icon: ShoppingCart,
    color: "emerald",
  },
  {
    title: "Pending Leads",
    value: "573",
    change: "+12.5%",
    positive: true,
    icon: TrendingUp,
    color: "orange",
  },
];

const chartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
];

const recentOrders = [
  {
    id: "#ORD-3214",
    customer: "Olivia Martin",
    product: "Mechanical Keyboard",
    amount: "$129.00",
    status: "Completed",
    date: "Oct 24, 2025",
  },
  {
    id: "#ORD-3213",
    customer: "Jackson Lee",
    product: "USB-C Hub",
    amount: "$45.00",
    status: "Processing",
    date: "Oct 23, 2025",
  },
  {
    id: "#ORD-3212",
    customer: "Isabella Nguyen",
    product: "4K Monitor",
    amount: "$399.00",
    status: "Completed",
    date: "Oct 23, 2025",
  },
];

// Status Badge
const StatusBadge = ({ status }) => {
  const colors = {
    Completed: "bg-green-100 text-green-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

// Main Dashboard UI
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
            <p className="text-slate-500">Welcome back! Here's today's summary.</p>
          </div>

          <div className="flex gap-2">
            <select className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm">
              Download Report
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500">{kpi.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-${kpi.color}-100`}>
                  <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                </div>
              </div>

              <div className="flex items-center mt-3 text-xs font-medium">
                {kpi.positive ? (
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-600 mr-1" />
                )}
                <span className={kpi.positive ? "text-green-600" : "text-red-600"}>
                  {kpi.change}
                </span>
                <span className="text-slate-400 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-bold mb-4">Revenue Overview</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    fill="url(#revColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Recent Sales</h3>
              <button className="text-sm text-indigo-600">View All</button>
            </div>

            <div className="space-y-4 overflow-auto">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition">
                  <div>
                    <p className="text-sm font-semibold">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{order.amount}</p>
                    <p className="text-xs text-slate-400">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
