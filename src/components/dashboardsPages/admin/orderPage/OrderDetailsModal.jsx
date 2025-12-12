import React from "react";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // 1. Helper: Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // 2. Helper: Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Mock Invoice Download Function
  const handleDownloadInvoice = () => {
    alert(`Downloading invoice for Order #${order._id}...`);
  };

  const styles = {
    overlay: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex", justifyContent: "center", alignItems: "center",
      animation: "fadeIn 0.2s"
    },
    modal: {
      background: "white",
      borderRadius: "16px",
      width: "90%", maxWidth: "700px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      fontFamily: '"Inter", sans-serif',
      maxHeight: "90vh",
      display: "flex", flexDirection: "column"
    },
    header: {
      padding: "20px 32px",
      borderBottom: "1px solid #f1f5f9",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "#f8fafc"
    },
    body: { 
      padding: "32px", 
      overflowY: "auto" 
    },
    footer: {
      padding: "20px 32px",
      background: "#fff",
      borderTop: "1px solid #f1f5f9",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    },
    label: { 
      fontSize: "11px", color: "#64748b", textTransform: "uppercase", 
      fontWeight: "700", letterSpacing: "0.5px", marginBottom: "4px", display: "block" 
    },
    value: { 
      fontSize: "14px", color: "#0f172a", fontWeight: "500", margin: 0,
      lineHeight: "1.5" 
    },
    sectionTitle: { 
      fontSize: "15px", fontWeight: "700", color: "#334155", 
      marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px"
    },
    gridTwo: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" },
    divider: { height: "1px", background: "#e2e8f0", margin: "24px 0" },
    
    // Status Tag Logic
    statusTag: (status) => {
      const s = status?.toLowerCase();
      let bg = "#f1f5f9"; let color = "#475569";
      if(s === "delivered") { bg = "#dcfce7"; color = "#166534"; }
      else if(s === "pending") { bg = "#fef9c3"; color = "#854d0e"; }
      else if(s === "cancelled") { bg = "#fee2e2"; color = "#991b1b"; }
      
      return {
        background: bg, color: color,
        padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700",
        display: "inline-block"
      };
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => { if(e.target === e.currentTarget) onClose() }}>
      <div style={styles.modal}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>Order Details</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>ID:</span>
              <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", color: "#475569" }}>
                {order._id}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "24px", color: "#94a3b8", cursor: "pointer" }}>&times;</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          
          {/* SECTION 1: Product & Financials */}
          <div style={styles.sectionTitle}>📦 Order Information</div>
          <div style={styles.gridTwo}>
            <div>
               <span style={styles.label}>Product ID</span>
               <p style={styles.value}>{order.productId?._id || "Unknown Product"}</p>
            </div>
            <div>
               <span style={styles.label}>Order Date</span>
               <p style={styles.value}>{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "32px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <span style={styles.label}>Quantity</span>
                  <p style={styles.value}>x {order.quantity}</p>
                </div>
                <div>
                  <span style={styles.label}>Price / Unit</span>
                  <p style={styles.value}>{formatCurrency(order.priceAtOrderTime)}</p>
                </div>
                <div>
                  <span style={styles.label}>Total Amount</span>
                  <p style={{ ...styles.value, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.gridTwo}>
            {/* SECTION 2: Customer & Agent */}
            <div>
              <div style={styles.sectionTitle}>👤 Customer Details</div>
              <div style={{ marginBottom: "16px" }}>
                 <span style={styles.label}>Name</span>
                 <p style={styles.value}>{order.customerName}</p>
              </div>
              <div style={{ marginBottom: "16px" }}>
                 <span style={styles.label}>Phone</span>
                 <p style={styles.value}>{order.phone}</p>
              </div>
              <div>
                 <span style={styles.label}>Address</span>
                 <p style={styles.value}>{order.address}</p>
                 <p style={{ ...styles.value, color: "#64748b", fontSize: "13px" }}>Pincode: {order.pincode}</p>
              </div>
            </div>

            {/* SECTION 3: Status & Shipping */}
            <div>
              <div style={styles.sectionTitle}>🚚 Status & Shipping</div>
              <div style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
                 <div>
                    <span style={styles.label}>Order Status</span>
                    <span style={styles.statusTag(order.orderStatus)}>{order.orderStatus}</span>
                 </div>
                 <div>
                    <span style={styles.label}>Payment</span>
                    <span style={{ 
                        color: order.paymentStatus === "Paid" ? "#16a34a" : "#d97706", 
                        fontWeight: "600", fontSize: "14px"
                    }}>{order.paymentStatus}</span>
                 </div>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                 <span style={styles.label}>Payment Mode</span>
                 <p style={styles.value}>{order.paymentMode} <span style={{color:"#94a3b8", fontSize:"12px"}}>(₹{order.totalAmount})</span></p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                 <span style={styles.label}>AWB Number</span>
                 <p style={{ ...styles.value, fontFamily: "monospace", letterSpacing: "1px" }}>
                    {order.awb || "Not Generated"}
                 </p>
              </div>

              {order.agentId && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#f0f9ff", borderRadius: "6px" }}>
                   <span style={{...styles.label, color: "#0369a1"}}>Managed By Agent</span>
                   <p style={{...styles.value, fontSize: "13px", color: "#0c4a6e"}}>{order.agentId.name}</p>
                   <p style={{fontSize: "12px", color: "#0ea5e9"}}>{order.agentId.email}</p>
                </div>
              )}
            </div>
          </div>
          
           {/* Remarks Section */}
           {order.remarks && (
            <div style={{ marginTop: "10px" }}>
                <span style={styles.label}>Remarks</span>
                <p style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>"{order.remarks}"</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button 
            onClick={onClose}
            style={{ padding: "10px 24px", border: "1px solid #cbd5e1", background: "white", borderRadius: "8px", fontWeight: "600", color: "#475569", cursor: "pointer" }}
          >
            Close
          </button>
          <button 
            onClick={handleDownloadInvoice}
            style={{ 
              padding: "10px 24px", 
              border: "none", 
              background: "#0f172a", 
              borderRadius: "8px", 
              fontWeight: "500", 
              color: "white", 
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <span>📄</span> Download Invoice
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;