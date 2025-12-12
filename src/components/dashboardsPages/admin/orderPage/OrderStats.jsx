import React from "react";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { 
  IndianRupee, 
  Package, 
  Truck, 
  AlertOctagon, 
  ArrowUpRight, 
  TrendingUp,
  MoreHorizontal
} from "lucide-react";

// --- DATA MOCK ---
const pieData = [
  { name: "Delivered", value: 65, color: "#10b981" }, // Emerald
  { name: "Pending", value: 20, color: "#f59e0b" },   // Amber
  { name: "Returns", value: 15, color: "#ef4444" },   // Red
];

const barData = [
  { day: "Mon", orders: 45, rev: 1200 },
  { day: "Tue", orders: 52, rev: 1500 },
  { day: "Wed", orders: 38, rev: 1100 },
  { day: "Thu", orders: 65, rev: 1900 },
  { day: "Fri", orders: 58, rev: 1700 },
  { day: "Sat", orders: 42, rev: 1400 },
  { day: "Sun", orders: 70, rev: 2100 },
];

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid white",
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)",
        fontFamily: "sans-serif"
      }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontWeight: "600" }}>{label}</p>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
          {payload[0].value} {payload[0].name === "rev" ? "Revenue" : "Orders"}
        </p>
      </div>
    );
  }
  return null;
};

const OrderStats = () => {

  // --- STYLES ---
  const styles = {
    container: {
      marginBottom: "40px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    // Top Row: Stats Cards
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    statCard: (color) => ({
      background: "linear-gradient(145deg, #ffffff, #f8fafc)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid white",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 5px 10px -5px rgba(0,0,0,0.02)",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.3s ease",
      cursor: "default"
    }),
    iconBox: (color, bg) => ({
      width: "48px", 
      height: "48px", 
      borderRadius: "14px",
      background: bg, 
      color: color,
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      boxShadow: `0 8px 16px -4px ${color}30` // Colored shadow
    }),
    statLabel: { fontSize: "13px", fontWeight: "600", color: "#64748b", marginBottom: "6px" },
    statValue: { fontSize: "28px", fontWeight: "800", color: "#1e293b", letterSpacing: "-0.5px" },
    statTrend: (isUp) => ({ 
      display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700",
      color: isUp ? "#10b981" : "#ef4444", background: isUp ? "#d1fae5" : "#fee2e2",
      padding: "4px 10px", borderRadius: "20px", marginTop: "12px"
    }),

    // Bottom Row: Charts
    chartsGrid: {
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
      gap: "24px"
    },
    chartCard: {
      background: "white",
      borderRadius: "24px",
      padding: "28px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.06)", // Deep shadow for 3D float
      height: "420px",
      display: "flex",
      flexDirection: "column"
    },
    chartHeader: {
      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"
    },
    chartTitle: { fontSize: "18px", fontWeight: "700", color: "#0f172a" },
    chartSub: { fontSize: "13px", color: "#64748b" }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. STATS CARDS ROW */}
      <div style={styles.statsGrid}>
        
        {/* Card 1: Revenue */}
        <div 
          style={styles.statCard()}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p style={styles.statLabel}>Total Revenue</p>
              <h3 style={styles.statValue}>₹ 12,45,200</h3>
            </div>
            <div style={styles.iconBox("#10b981", "#d1fae5")}>
              <IndianRupee size={24} />
            </div>
          </div>
          <span style={styles.statTrend(true)}><ArrowUpRight size={14}/> +15%</span>
        </div>

        {/* Card 2: Orders */}
        <div 
          style={styles.statCard()}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p style={styles.statLabel}>Total Orders</p>
              <h3 style={styles.statValue}>1,850</h3>
            </div>
            <div style={styles.iconBox("#3b82f6", "#dbeafe")}>
              <Package size={24} />
            </div>
          </div>
          <span style={styles.statTrend(true)}><ArrowUpRight size={14}/> +8.2%</span>
        </div>

        {/* Card 3: Returns */}
        <div 
          style={styles.statCard()}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <p style={styles.statLabel}>Returns / RTO</p>
              <h3 style={styles.statValue}>24</h3>
            </div>
            <div style={styles.iconBox("#ef4444", "#fee2e2")}>
              <AlertOctagon size={24} />
            </div>
          </div>
          <span style={styles.statTrend(false)}><TrendingUp size={14}/> -2% (Improved)</span>
        </div>

      </div>


      {/* 2. CHARTS ROW */}
      <div style={styles.chartsGrid}>
        
        {/* A. 3D BAR CHART (Orders Trend) */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <h3 style={styles.chartTitle}>Weekly Sales Trend</h3>
              <p style={styles.chartSub}>Revenue vs Orders</p>
            </div>
            <button style={{ background: "#f1f5f9", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer" }}>
              <MoreHorizontal size={20} color="#64748b" />
            </button>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={8}>
              <defs>
                {/* Gradients for 3D Look */}
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#4338ca" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
              
              {/* Bars with Radius for cylindrical look */}
              <Bar dataKey="rev" fill="url(#colorRev)" radius={[6, 6, 0, 0]} barSize={12} animationDuration={1500} />
              <Bar dataKey="orders" fill="url(#colorOrd)" radius={[6, 6, 0, 0]} barSize={12} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* B. 3D PIE CHART (Status Distribution) */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
             <div>
              <h3 style={styles.chartTitle}>Order Status</h3>
              <p style={styles.chartSub}>Distribution across pipeline</p>
            </div>
          </div>
          
          {/* Chart Container */}
          <div style={{ flex: 1, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                   {/* Glow Filter for 3D Effect */}
                   <filter id="shadow" height="200%">
                      <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.15"/>
                   </filter>
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80} // Donut style
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  filter="url(#shadow)" // Apply the shadow filter
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text (Total Orders) */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              textAlign: "center", pointerEvents: "none"
            }}>
               <span style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", display: "block" }}>85%</span>
               <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Success Rate</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "10px" }}>
            {pieData.map((item) => (
               <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                  <span style={{ fontSize: "13px", color: "#475569", fontWeight: "500" }}>{item.name}</span>
               </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderStats;