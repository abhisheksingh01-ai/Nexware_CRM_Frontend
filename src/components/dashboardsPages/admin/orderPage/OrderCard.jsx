import React from "react";
import { User, Package, Calendar, CreditCard, ChevronRight, MapPin } from "lucide-react";

const OrderCard = ({ order, onClick }) => {
  
  // 1. Determine Color Theme based on Status
  const getTheme = (status) => {
    switch (status) {
      case "Delivered": return { color: "#16a34a", bg: "#dcfce7", border: "#16a34a" }; // Green
      case "Cancelled": return { color: "#dc2626", bg: "#fee2e2", border: "#dc2626" }; // Red
      case "Shipped": return { color: "#4f46e5", bg: "#e0e7ff", border: "#4f46e5" };   // Indigo
      default: return { color: "#ca8a04", bg: "#fef9c3", border: "#ca8a04" };          // Yellow (Pending)
    }
  };

  const theme = getTheme(order.status);

  // 2. CSS Styles
  const styles = {
    card: {
      background: "white",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      minHeight: "220px"
    },
    topStrip: {
      height: "4px",
      width: "100%",
      background: theme.border,
      position: "absolute",
      top: 0, left: 0
    },
    header: {
      padding: "20px 20px 10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    },
    avatar: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      background: "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#64748b",
      border: "1px solid #e2e8f0"
    },
    statusBadge: {
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: "20px",
      background: theme.bg,
      color: theme.color,
      letterSpacing: "0.5px"
    },
    body: {
      padding: "0 20px",
      flex: 1
    },
    customerName: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#0f172a",
      marginTop: "12px",
      marginBottom: "2px"
    },
    location: {
      fontSize: "13px",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginBottom: "16px"
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      paddingTop: "16px",
      borderTop: "1px dashed #e2e8f0"
    },
    infoItem: {
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },
    infoLabel: {
      fontSize: "11px",
      color: "#94a3b8",
      fontWeight: "600",
      textTransform: "uppercase"
    },
    infoValue: {
      fontSize: "13px",
      color: "#334155",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    footer: {
      marginTop: "20px",
      padding: "12px 20px",
      background: "#f8fafc",
      borderTop: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "13px",
      fontWeight: "600",
      color: "#475569"
    }
  };

  return (
    <div 
      onClick={onClick}
      style={styles.card}
      // Hover Lift Effect
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 20px -5px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = theme.border; // Border changes to status color on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* 1. Top Color Strip */}
      <div style={styles.topStrip}></div>

      {/* 2. Header: Avatar & Status */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          <User size={20} />
        </div>
        <span style={styles.statusBadge}>{order.status}</span>
      </div>

      {/* 3. Main Content */}
      <div style={styles.body}>
        <h3 style={styles.customerName}>{order.customerName}</h3>
        <div style={styles.location}>
          <MapPin size={12} /> {order.address.split(',')[0]} {/* Shows just the city/area */}
        </div>

        {/* Data Grid */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Product</span>
            <div style={styles.infoValue}>
              <Package size={14} color="#64748b" /> {order.productName}
            </div>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Amount</span>
            <div style={{ ...styles.infoValue, color: "#0f172a", fontWeight: "700" }}>
              ₹ {order.totalAmount}
            </div>
          </div>

          <div style={styles.infoItem}>
             <span style={styles.infoLabel}>Date</span>
             <div style={styles.infoValue}>
                <Calendar size={14} color="#64748b" /> {order.createdAt}
             </div>
          </div>

          <div style={styles.infoItem}>
             <span style={styles.infoLabel}>Payment</span>
             <div style={styles.infoValue}>
                <CreditCard size={14} color="#64748b" /> {order.paymentStatus}
             </div>
          </div>
        </div>
      </div>

      {/* 4. Footer Action */}
      <div style={styles.footer}>
        <span>#{order.orderId}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: theme.color }}>
          Details <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default OrderCard;