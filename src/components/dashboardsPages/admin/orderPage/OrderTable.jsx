import React, { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  MoreVertical,
  Calendar,
  CreditCard,
  Filter,
  Download
} from "lucide-react";
import api from "../../../../api/api";
import { useAuthStore } from "../../../../store/authStore";
import axios from "axios";

const OrderTable = ({ orders = [], onRowClick, onRefresh, onDetailsFetched }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const { user: authUser } = useAuthStore();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB'); 
  };

  // --- HANDLER: Fetch & Pass Up ---
  const handleDetails = async (id) => {
    try {
      // 1. Close menu immediately
      setActiveMenuId(null);

      const token = authUser?.token;
      
      // 2. Fetch Data
      const response = await axios.get(`${api.Order.GetOne}?orderId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const orderData = response.data.data;
      if (onDetailsFetched) {
        onDetailsFetched(orderData);
      } else {
        console.error("Critical: onDetailsFetched prop is missing in <OrderTable>");
      }

    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load order details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      setActiveMenuId(null);
      await axios.delete(api.Order.Delete, {
        headers: { Authorization: `Bearer ${authUser?.token}` },
        data: { orderId: id }, 
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete order");
    }
  };

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenuId && !event.target.closest('.action-menu-container')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : "";
    const map = {
      pending: { bg: "#fef9c3", text: "#a16207", dot: "#eab308" },
      confirmed: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
      packed: { bg: "#e0f2fe", text: "#0c4a6e", dot: "#0284c7" },
      shipped: { bg: "#e0e7ff", text: "#4338ca", dot: "#6366f1" },
      delivered: { bg: "#dcfce7", text: "#15803d", dot: "#16a34a" },
      cancelled: { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" },
    };
    return map[s] || { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" };
  };

  // Styles (Using your previous styling)
  const styles = {
    container: { background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", position: "relative", minHeight: "400px" },
    header: { padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
    btnGroup: { display: "flex", gap: "12px" },
    btnBase: { padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
    tableWrapper: { width: "100%", overflowX: "auto", paddingBottom: "50px" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "900px" },
    th: { padding: "14px 24px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" },
    row: { borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" },
    td: { padding: "16px 24px", fontSize: "14px", color: "#334155", verticalAlign: "middle" },
    menuBtn: (isOpen) => ({ border: "none", background: isOpen ? "#eff6ff" : "transparent", color: isOpen ? "#3b82f6" : "#94a3b8", borderRadius: "6px", padding: "6px", cursor: "pointer" }),
    dropdown: { position: "absolute", right: 0, top: "100%", marginTop: "4px", width: "160px", background: "white", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 50, padding: "6px" },
    menuItem: { padding: "10px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", borderRadius: "6px" }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Recent Orders</h3>
        <div style={styles.btnGroup}>
          <button style={{ ...styles.btnBase, border: "1px solid #cbd5e1", background: "white" }}><Filter size={16} /> Filter</button>
          <button style={{ ...styles.btnBase, background: "#0f172a", color: "white" }}><Download size={16} /> Export</button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}># ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Date</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No orders found.</td></tr>
            ) : (
              orders.map((order, index) => {
                const orderId = order._id || order.id;
                const statusStyle = getStatusStyle(order.orderStatus);
                const isMenuOpen = activeMenuId === orderId;

                return (
                  <tr
                    key={orderId}
                    style={styles.row}
                    // Trigger row click ONLY if menu is not interacting
                    onClick={() => !isMenuOpen && onRowClick && onRowClick(order)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  >
                    <td style={styles.td}><span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontFamily: "monospace", fontSize: "12px" }}>{index + 1}</span></td>
                    <td style={styles.td}><div style={{ fontWeight: "500" }}>{order.customerName}</div></td>
                    <td style={styles.td}>
                      <span style={{ ...statusStyle, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px", border: `1px solid ${statusStyle.bg}` }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusStyle.dot }}></span>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={styles.td}>₹{order.totalAmount}</td>
                    <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CreditCard size={14} color="#94a3b8" />
                            <span style={{ color: order.paymentStatus === "Paid" ? "#16a34a" : "#d97706", fontWeight: "500" }}>{order.paymentStatus}</span>
                        </div>
                    </td>
                    <td style={styles.td}><div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b" }}><Calendar size={14} />{formatDate(order.date || order.createdAt)}</div></td>
                    
                    {/* Action Menu */}
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={{ position: "relative" }} className="action-menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Stop row click
                            setActiveMenuId(activeMenuId === orderId ? null : orderId);
                          }}
                          style={styles.menuBtn(isMenuOpen)}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {isMenuOpen && (
                          <div style={styles.dropdown}>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDetails(orderId);
                              }}
                              style={{ ...styles.menuItem, color: "#334155" }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <Eye size={14} /> View Details
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(orderId);
                              }}
                              style={{ ...styles.menuItem, color: "#ef4444" }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <Trash2 size={14} /> Delete
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;