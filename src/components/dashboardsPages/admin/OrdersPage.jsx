import React, { useState } from "react";
import { dummyOrders } from "./orderPage/dummyOrders";
import OrderCard from "./orderPage/OrderCard";
import OrderTable from "./orderPage/OrderTable";
import OrderDetailsModal from "./orderPage/OrderDetailsModal";
import OrderHeader from "./orderPage/OrderHeader";
import OrderStats from "./orderPage/OrderStats";

const OrdersPage = () => {
  const [orders] = useState(dummyOrders);
  const [view, setView] = useState("table");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Styles
  const styles = {
    container: {
      padding: "40px",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px"
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#0f172a",
      margin: 0
    },
    subtitle: {
      color: "#64748b",
      margin: "4px 0 0 0",
      fontSize: "14px"
    },
    toggleContainer: {
      display: "flex",
      background: "white",
      padding: "4px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
    },
    toggleBtn: (isActive) => ({
      padding: "8px 16px",
      border: "none",
      background: isActive ? "#eff6ff" : "transparent",
      color: isActive ? "#3b82f6" : "#64748b",
      fontWeight: "600",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }),
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "24px"
    }
  };

  return (
    <>
      {/* Header */}
      <OrderHeader />
      <OrderStats/>

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Orders</h1>
            <p style={styles.subtitle}>Manage and track your customer orders</p>
          </div>

          {/* View Toggle */}
          <div style={styles.toggleContainer}>
            <button 
              onClick={() => setView("table")} 
              style={styles.toggleBtn(view === "table")}
            >
              Table List
            </button>
            <button 
              onClick={() => setView("cards")} 
              style={styles.toggleBtn(view === "cards")}
            >
              Grid Cards
            </button>
          </div>
        </div>

        {/* Content */}
        {view === "table" ? (
          <OrderTable orders={orders} onRowClick={setSelectedOrder} />
        ) : (
          <div style={styles.gridContainer}>
            {orders.map((o) => (
              <OrderCard 
                key={o.orderId} 
                order={o} 
                onClick={() => setSelectedOrder(o)} 
              />
            ))}
          </div>
        )}

        {/* Popup */}
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </div>
    </>
  );
};

export default OrdersPage;
