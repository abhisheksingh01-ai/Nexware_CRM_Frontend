import React, { useState, useEffect, useRef } from "react";
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

const OrderTable = ({ orders = [], onRowClick, onRefresh }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // 1. Get authUser correctly
  const { user: authUser } = useAuthStore();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // 2. FIXED DELETE HANDLER
  // Added 'id' as a parameter here so we know which order to delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }
    try {
      const token = authUser?.token; 
      await axios.delete(api.Order.Delete, {
        headers: { Authorization: `Bearer ${token}` },
        data: { orderId: id }, 
      });

      alert("Order deleted successfully!");
      setActiveMenuId(null);

      // Refresh the table
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      const msg = error.response?.data?.message || "Failed to delete order";
      alert(msg);
    }
  };

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
    const s = status ? status.toLowerCase() : "";
    switch (s) {
      case "pending": return { bg: "#fef9c3", text: "#a16207", dot: "#eab308" };
      case "confirmed": return { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" };
      case "packed": return { bg: "#e0f2fe", text: "#0c4a6e", dot: "#0284c7" };
      case "shipped": return { bg: "#e0e7ff", text: "#4338ca", dot: "#6366f1" };
      case "in transit": return { bg: "#fff7ed", text: "#c2410c", dot: "#f97316" };
      case "out for delivery": return { bg: "#fef3c7", text: "#78350f", dot: "#f59e0b" };
      case "delivered": return { bg: "#dcfce7", text: "#15803d", dot: "#16a34a" };
      case "cancelled": return { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" };
      default: return { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" };
    }
  };

  const styles = {
    container: {
      background: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      fontFamily: '"Inter", sans-serif',
      position: "relative",
      minHeight: "400px",
    },
    header: {
      padding: "20px 24px",
      borderBottom: "1px solid #f1f5f9",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "white",
      borderRadius: "12px 12px 0 0",
    },
    headerBtnGroup: { display: "flex", gap: "12px" },
    btnBase: {
      padding: "8px 16px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
    },
    btnOutline: {
      border: "1px solid #cbd5e1",
      background: "#ffffff",
      color: "#475569",
    },
    btnPrimary: {
      border: "1px solid #0f172a",
      background: "#0f172a",
      color: "#ffffff",
      boxShadow: "0 2px 4px rgba(15, 23, 42, 0.2)",
    },
    tableWrapper: {
      width: "100%",
      overflowX: "auto",
      overflowY: "visible",
      paddingBottom: "100px",
    },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "900px" },
    thead: { background: "#f8fafc" },
    th: {
      padding: "14px 24px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#64748b",
      textTransform: "uppercase",
      borderBottom: "1px solid #e2e8f0",
    },
    row: { borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" },
    td: {
      padding: "16px 24px",
      fontSize: "14px",
      color: "#334155",
      verticalAlign: "middle",
    },
    idBadge: {
      background: "#f1f5f9",
      color: "#64748b",
      fontWeight: "600",
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontFamily: "monospace",
    },
    statusBadge: (style) => ({
      background: style.bg,
      color: style.text,
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      border: `1px solid ${style.bg}`,
    }),
    menuContainer: { position: "relative" },
    menuBtn: (isOpen) => ({
      border: "none",
      background: isOpen ? "#eff6ff" : "transparent",
      color: isOpen ? "#3b82f6" : "#94a3b8",
      borderRadius: "6px",
      padding: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      transition: "background 0.2s",
    }),
    dropdown: {
      position: "absolute",
      right: "0px",
      top: "100%",
      marginTop: "4px",
      width: "160px",
      background: "white",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      zIndex: 50,
      padding: "6px",
      overflow: "hidden",
    },
    menuItem: {
      padding: "10px",
      fontSize: "13px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderRadius: "6px",
      transition: "background 0.1s",
    },
    emptyState: {
      padding: "40px",
      textAlign: "center",
      color: "#64748b",
      fontSize: "14px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
          Latest Orders
        </h3>
        <div style={styles.headerBtnGroup}>
          <button style={{ ...styles.btnBase, ...styles.btnOutline }}>
            <Filter size={16} /> Filter
          </button>
          <button style={{ ...styles.btnBase, ...styles.btnPrimary }}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}># ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Date</th>
              <th style={{ ...styles.th, textAlign: "right", width: "60px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody ref={menuRef}>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.emptyState}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                // Ensure we fallback to 'id' if '_id' is missing
                const orderId = order._id || order.id;
                const displayId = String(index + 1).padStart(2, "0");
                const statusStyle = getStatusStyle(order.orderStatus);
                const isMenuOpen = activeMenuId === orderId;

                return (
                  <tr
                    key={orderId}
                    style={styles.row}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <td style={styles.td}>
                      <span style={styles.idBadge}>{displayId}</span>
                    </td>

                    <td style={styles.td}>
                      <div style={{ fontWeight: "500", color: "#1e293b" }}>
                        {order.customerName}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.statusBadge(statusStyle)}>
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: statusStyle.dot,
                          }}
                        ></span>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>
                        ₹{order.totalAmount}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <CreditCard size={14} color="#94a3b8" />
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "13px",
                            color:
                              order.paymentStatus === "Paid"
                                ? "#16a34a"
                                : "#d97706",
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#64748b",
                        }}
                      >
                        <Calendar size={14} />
                        {formatDate(order.date || order.createdAt)}
                      </div>
                    </td>

                    {/* ACTION MENU */}
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={styles.menuContainer}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === orderId ? null : orderId
                            );
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
                                setActiveMenuId(null);
                                onRowClick && onRowClick(order);
                              }}
                              style={{ ...styles.menuItem, color: "#334155" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#f1f5f9")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                            >
                              <Eye size={14} /> View Details
                            </div>

                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                // PASS THE ID HERE
                                handleDelete(orderId);
                              }}
                              style={{ ...styles.menuItem, color: "#ef4444" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#fef2f2")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
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