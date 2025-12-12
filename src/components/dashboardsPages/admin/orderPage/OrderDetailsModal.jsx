import React from "react";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // Mock Invoice Download Function
  const handleDownloadInvoice = () => {
    alert(`Downloading invoice for Order #${order.orderId}...`);
    // In a real app, you would fetch a PDF URL here.
  };

  const styles = {
    overlay: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex", justifyContent: "center", alignItems: "center",
      animation: "fadeIn 0.2s"
    },
    modal: {
      background: "white",
      borderRadius: "16px",
      width: "90%", maxWidth: "650px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      fontFamily: "sans-serif"
    },
    header: {
      padding: "24px",
      borderBottom: "1px solid #f1f5f9",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "#f8fafc"
    },
    body: { padding: "32px" },
    footer: {
      padding: "20px 32px",
      background: "#f8fafc",
      borderTop: "1px solid #f1f5f9",
      display: "flex", justifyContent: "flex-end", gap: "12px"
    },
    label: { fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px", marginBottom: "6px", display: "block" },
    value: { fontSize: "15px", color: "#1e293b", fontWeight: "500", margin: 0 },
    sectionTitle: { fontSize: "14px", fontWeight: "700", color: "#334155", marginBottom: "16px", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px", display: "inline-block" }
  };

  return (
    <div style={styles.overlay} onClick={(e) => { if(e.target === e.currentTarget) onClose() }}>
      <div style={styles.modal}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>Order Details</h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>ID: {order.orderId}</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", fontSize: "18px", color: "#64748b" }}>×</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            
            {/* Column 1 */}
            <div>
              <div style={{ marginBottom: "24px" }}>
                <span style={styles.sectionTitle}>Product Info</span>
                <div style={{ marginBottom: "16px" }}>
                   <span style={styles.label}>Product Name</span>
                   <p style={styles.value}>{order.productName}</p>
                </div>
                <div>
                   <span style={styles.label}>Order Date</span>
                   <p style={styles.value}>{order.createdAt}</p>
                </div>
              </div>

              <div>
                <span style={styles.sectionTitle}>Status</span>
                <div style={{ marginBottom: "16px" }}>
                   <span style={styles.label}>Order Status</span>
                   <span style={{ 
                     background: order.status === "Delivered" ? "#dcfce7" : "#fef9c3",
                     color: order.status === "Delivered" ? "#166534" : "#854d0e",
                     padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "700"
                   }}>{order.status}</span>
                </div>
                <div>
                   <span style={styles.label}>Payment</span>
                   <p style={styles.value}>{order.paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div style={{ marginBottom: "24px" }}>
                <span style={styles.sectionTitle}>Customer</span>
                <div style={{ marginBottom: "16px" }}>
                   <span style={styles.label}>Name</span>
                   <p style={styles.value}>{order.customerName}</p>
                </div>
                <div>
                   <span style={styles.label}>Contact</span>
                   <p style={styles.value}>{order.phone}</p>
                </div>
              </div>

              <div>
                <span style={styles.sectionTitle}>Delivery</span>
                <div>
                   <span style={styles.label}>Address</span>
                   <p style={styles.value}>{order.address}</p>
                   <p style={{ ...styles.value, fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Pin: {order.pincode}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer with Download Button */}
        <div style={styles.footer}>
          <button 
            onClick={onClose}
            style={{ padding: "10px 20px", border: "1px solid #e2e8f0", background: "white", borderRadius: "8px", fontWeight: "600", color: "#64748b", cursor: "pointer" }}
          >
            Close
          </button>
          <button 
            onClick={handleDownloadInvoice}
            style={{ 
              padding: "10px 20px", 
              border: "none", 
              background: "#3b82f6", 
              borderRadius: "8px", 
              fontWeight: "600", 
              color: "white", 
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <span>⬇</span> Download Invoice
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;