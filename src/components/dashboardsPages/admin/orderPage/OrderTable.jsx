import React, { useState, useEffect, useRef } from "react";
import { 
  Eye, 
  Trash2, 
  MoreVertical, 
  Calendar,
  CreditCard 
} from "lucide-react";

const OrderTable = ({ orders, onRowClick }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered": return { bg: "#dcfce7", text: "#166534", dot: "#16a34a" };
      case "Shipped":   return { bg: "#e0e7ff", text: "#4338ca", dot: "#6366f1" };
      case "Pending":   return { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" };
      case "Cancelled": return { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" };
      default:          return { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" };
    }
  };

  const styles = {
    container: {
      background: "white",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: "relative",
      minHeight: "300px" 
    },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
    thead: { background: "#f8fafc", borderBottom: "1px solid #e2e8f0" },
    th: { padding: "16px 24px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    row: { borderBottom: "1px solid #f1f5f9", cursor: "pointer", position: "relative" },
    td: { padding: "16px 24px", color: "#334155", fontSize: "14px", verticalAlign: "middle" },
    avatarBox: {
      width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6",
      display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px",
      fontSize: "12px", fontWeight: "bold", border: "1px solid #dbeafe"
    },
    customerCell: { display: "flex", alignItems: "center" },
    statusBadge: (style) => ({
      background: style.bg, color: style.text, padding: "6px 12px", borderRadius: "20px",
      fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px"
    }),
    statusDot: (color) => ({ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: color }),
    amount: { fontWeight: "600", color: "#0f172a", fontSize: "15px" },
    menuBtn: {
      padding: "8px", borderRadius: "50%", border: "none", background: "transparent",
      cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background 0.2s"
    },
    dropdown: {
      position: "absolute", right: "50px", marginTop: "-10px", width: "160px",
      background: "white", borderRadius: "12px", border: "1px solid #e2e8f0",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      zIndex: 50, padding: "6px", animation: "fadeIn 0.1s ease-out"
    },
    menuItem: (color = "#334155") => ({
      padding: "10px 12px", fontSize: "13px", fontWeight: "500", color: color,
      display: "flex", alignItems: "center", gap: "8px", borderRadius: "8px",
      cursor: "pointer", transition: "background 0.1s"
    })
  };

  const handleMenuClick = (e, orderId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === orderId ? null : orderId);
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Order ID</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Payment</th>
            <th style={styles.th}>Date</th>
            <th style={{...styles.th, textAlign: "right"}}>Action</th>
          </tr>
        </thead>
        <tbody ref={menuRef}>
          {/* FIX: Added index as fallback key to prevent warnings if IDs duplicate */}
          {orders.map((order, index) => {
            const statusStyle = getStatusStyle(order.status);
            const isMenuOpen = activeMenuId === order.orderId;
            // Use orderId if valid, otherwise fallback to index
            const rowKey = order.orderId || index; 
            
            return (
              <tr 
                key={rowKey} // <--- Key Property Fixed Here
                onClick={() => onRowClick(order)}
                style={styles.row}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
              >
                <td style={{ ...styles.td, fontFamily: "monospace", color: "#64748b" }}>
                  #{order.orderId}
                </td>

                <td style={styles.td}>
                  <div style={styles.customerCell}>
                    <div style={styles.avatarBox}>
                      {order.customerName ? order.customerName.charAt(0) : "U"}
                    </div>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {order.customerName}
                    </span>
                  </div>
                </td>

                <td style={styles.td}>
                  <span style={styles.statusBadge(statusStyle)}>
                    <span style={styles.statusDot(statusStyle.dot)}></span>
                    {order.status}
                  </span>
                </td>

                <td style={styles.td}>
                  <div style={styles.amount}>₹ {order.totalAmount}</div>
                </td>

                 <td style={styles.td}>
                   <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <CreditCard size={14} color="#94a3b8" />
                      <span style={{ 
                        fontWeight: "500", 
                        fontSize: "13px",
                        color: order.paymentStatus === "Paid" ? "#16a34a" : "#ca8a04"
                      }}>
                        {order.paymentStatus}
                      </span>
                   </div>
                </td>

                <td style={styles.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b" }}>
                    <Calendar size={14} />
                    {order.createdAt}
                  </div>
                </td>

                <td style={{ ...styles.td, textAlign: "right", position: "relative" }}>
                  <button 
                    onClick={(e) => handleMenuClick(e, order.orderId)}
                    style={{
                      ...styles.menuBtn,
                      background: isMenuOpen ? "#eff6ff" : "transparent",
                      color: isMenuOpen ? "#3b82f6" : "#94a3b8"
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {isMenuOpen && (
                    <div style={styles.dropdown}>
                      <div 
                        onClick={(e) => { e.stopPropagation(); onRowClick(order); setActiveMenuId(null); }}
                        style={styles.menuItem("#334155")}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <Eye size={16} /> View / Edit
                      </div>
                      
                      <div 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); alert("Deleted"); }}
                        style={styles.menuItem("#ef4444")}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <Trash2 size={16} /> Delete
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div style={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderRadius: "0 0 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b" }}>
        <span>Showing <strong>{orders.length}</strong> active orders</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ cursor: "pointer", opacity: 0.5 }}>Prev</span>
          <span style={{ fontWeight: "600", color: "#0f172a" }}>1</span>
          <span style={{ cursor: "pointer", opacity: 0.5 }}>Next</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;