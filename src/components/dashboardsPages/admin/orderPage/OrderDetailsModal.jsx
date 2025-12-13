import React, { useState, useEffect } from "react";

const OrderDetailsModal = ({ order, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableOrder, setEditableOrder] = useState(null);

  useEffect(() => {
    if (order) setEditableOrder(order);
  }, [order]);

  if (!editableOrder) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving Updated Order:", editableOrder);
    alert("Order updated successfully! (Mock Action)");
    setIsEditing(false);
  };

  // --- Invoice Generator ---
  const handleDownloadInvoice = () => {
    const printWindow = window.open("", "", "height=800,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${editableOrder._id.slice(-6)}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; }
            .header-row { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
            .invoice-tag { background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 4px; font-weight: 600; font-size: 12px; text-transform: uppercase; }
            .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; margin-bottom: 8px; }
            .info-block { margin-bottom: 24px; }
            .info-text { font-size: 14px; line-height: 1.6; color: #334155; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { text-align: left; padding: 12px 0; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #64748b; }
            td { padding: 16px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; }
            .total-section { display: flex; justify-content: flex-end; margin-top: 20px; }
            .total-box { width: 300px; background: #f8fafc; padding: 20px; border-radius: 8px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .grand-total { font-weight: 800; font-size: 18px; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header-row">
            <div>
              <div class="brand">INVOICE</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">Date: ${new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <span class="invoice-tag">#${editableOrder._id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between;">
             <div class="info-block">
                <div class="section-title">Billed To</div>
                <div class="info-text">
                   <strong>${editableOrder.customerName}</strong><br>
                   ${editableOrder.address}<br>
                   Pincode: ${editableOrder.pincode}<br>
                   Phone: ${editableOrder.phone}
                </div>
             </div>
             <div class="info-block" style="text-align: right;">
                <div class="section-title">Logistics</div>
                <div class="info-text">
                   Status: ${editableOrder.orderStatus}<br>
                   AWB: ${editableOrder.awb || 'N/A'}<br>
                   Agent: ${editableOrder.agentId?.name || 'Assigned Agent'}
                </div>
             </div>
          </div>

          <table>
            <thead>
              <tr><th style="width:50%">Item</th><th>Qty</th><th>Unit Price</th><th style="text-align:right">Total</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${editableOrder.productId?.name || "Product ID: " + editableOrder.productId?._id}</strong><br>
                  <span style="font-size:12px; color:#64748b">Item SKU / ID Ref</span>
                </td>
                <td>${editableOrder.quantity}</td>
                <td>₹${editableOrder.priceAtOrderTime}</td>
                <td style="text-align:right">₹${editableOrder.totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
               <div class="row"><span>Subtotal</span> <span>₹${editableOrder.totalAmount}</span></div>
               <div class="row"><span>Payment Mode</span> <span>${editableOrder.paymentMode}</span></div>
               ${editableOrder.paymentMode === "Partial Payment" ? `
               <div class="row" style="color:#16a34a"><span>Paid (Deposit)</span> <span>- ₹${editableOrder.depositedAmount}</span></div>
               <div class="row grand-total" style="color:#dc2626"><span>Due Amount</span> <span>₹${editableOrder.remainingAmount}</span></div>
               ` : `
               <div class="row grand-total"><span>Total Paid</span> <span>₹${editableOrder.totalAmount}</span></div>
               `}
            </div>
          </div>
          
          <div style="margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8;">
             Computer generated invoice. No signature required.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // --- Styles ---
  const styles = {
    overlay: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)",
      zIndex: 1200, display: "flex", justifyContent: "center", alignItems: "center",
      animation: "fadeIn 0.2s ease-out"
    },
    modal: {
      background: "#fff", borderRadius: "24px", width: "95%", maxWidth: "900px",
      maxHeight: "92vh", display: "flex", flexDirection: "column",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", overflow: "hidden",
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
    },
    // Header
    header: {
      padding: "24px 32px", borderBottom: "1px solid #f1f5f9",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "#ffffff"
    },
    headerLeft: { display: "flex", flexDirection: "column", gap: "4px" },
    orderId: { fontSize: "13px", color: "#64748b", fontWeight: "600", letterSpacing: "0.5px" },
    title: { fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
    
    // Body Layout
    body: { 
      padding: "32px", overflowY: "auto", background: "#f8fafc",
      display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "24px" // Dashboard grid
    },
    
    // Cards
    card: {
      background: "#ffffff", borderRadius: "16px", padding: "24px",
      border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
      display: "flex", flexDirection: "column", gap: "20px"
    },
    cardHeader: {
      fontSize: "14px", fontWeight: "700", color: "#0f172a", 
      display: "flex", alignItems: "center", gap: "8px", paddingBottom: "16px",
      borderBottom: "1px dashed #e2e8f0", marginBottom: "4px"
    },

    // Fields
    fieldRow: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" },
    label: { color: "#64748b", fontWeight: "500" },
    value: { color: "#1e293b", fontWeight: "600", textAlign: "right" },
    input: {
      padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
      fontSize: "13px", outline: "none", width: "100%", transition: "all 0.2s",
      background: "#f8fafc"
    },
    
    // Status Badge
    badge: (status) => {
      const config = {
        Paid: { bg: "#dcfce7", text: "#166534" },
        Pending: { bg: "#ffedd5", text: "#9a3412" },
        Failed: { bg: "#fee2e2", text: "#991b1b" },
        "Partial Payment": { bg: "#e0f2fe", text: "#075985" },
        Delivered: { bg: "#d1fae5", text: "#065f46" },
        Cancelled: { bg: "#fef2f2", text: "#ef4444" },
        Default: { bg: "#f1f5f9", text: "#475569" }
      };
      const style = config[status] || config.Default;
      return {
        background: style.bg, color: style.text, padding: "4px 10px", 
        borderRadius: "20px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase"
      };
    },

    // Footer
    footer: {
      padding: "20px 32px", background: "#ffffff", borderTop: "1px solid #f1f5f9",
      display: "flex", justifyContent: "flex-end", gap: "12px"
    },
    btn: (variant) => ({
      padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "600",
      cursor: "pointer", border: variant === "primary" ? "none" : "1px solid #e2e8f0",
      background: variant === "primary" ? "#0f172a" : "#ffffff",
      color: variant === "primary" ? "#ffffff" : "#475569",
      transition: "all 0.2s"
    }),
    invoiceBtn: {
        background: "#eff6ff", color: "#2563eb", border: "none", padding: "8px 16px",
        borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "6px"
    }
  };

  const InfoRow = ({ label, value, name, type = "text" }) => (
    <div style={styles.fieldRow}>
      <span style={styles.label}>{label}</span>
      {isEditing ? (
        <div style={{ width: "60%" }}>
           <input style={styles.input} name={name} value={value} onChange={handleInputChange} type={type} />
        </div>
      ) : (
        <span style={styles.value}>{value || "-"}</span>
      )}
    </div>
  );

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        
        {/* --- HEADER --- */}
        <div style={styles.header}>
           <div style={styles.headerLeft}>
              <span style={styles.orderId}>ORDER #{editableOrder._id.slice(-6).toUpperCase()}</span>
              <h2 style={styles.title}>Order Details</h2>
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button style={styles.invoiceBtn} onClick={handleDownloadInvoice}>
                 <span>📄</span> Download Invoice
              </button>
              <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "28px", color: "#94a3b8", cursor: "pointer" }}>&times;</button>
           </div>
        </div>

        {/* --- DASHBOARD BODY --- */}
        <div style={styles.body}>
           
           {/* LEFT COLUMN: CONTEXT */}
           <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Customer Card */}
              <div style={styles.card}>
                 <div style={styles.cardHeader}>👤 Customer Information</div>
                 <InfoRow label="Name" name="customerName" value={editableOrder.customerName} />
                 <InfoRow label="Phone" name="phone" value={editableOrder.phone} />
                 <InfoRow label="Pincode" name="pincode" value={editableOrder.pincode} />
                 
                 <div style={{ marginTop: "8px" }}>
                    <span style={{ ...styles.label, display:"block", marginBottom:"6px" }}>Shipping Address</span>
                    {isEditing ? (
                        <textarea style={{ ...styles.input, height: "60px", resize: "none" }} name="address" value={editableOrder.address} onChange={handleInputChange} />
                    ) : (
                        <div style={{ ...styles.value, textAlign: "left", lineHeight: "1.5", fontSize: "13px" }}>{editableOrder.address}</div>
                    )}
                 </div>
              </div>

              {/* Logistics Card */}
              <div style={styles.card}>
                 <div style={styles.cardHeader}>🚚 Logistics & Status</div>
                 <div style={styles.fieldRow}>
                    <span style={styles.label}>Current Status</span>
                    {isEditing ? (
                        <select style={styles.input} name="orderStatus" value={editableOrder.orderStatus} onChange={handleInputChange}>
                           <option>Pending</option><option>Confirmed</option><option>Packed</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                        </select>
                    ) : (
                        <span style={styles.badge(editableOrder.orderStatus)}>{editableOrder.orderStatus}</span>
                    )}
                 </div>
                 <InfoRow label="AWB Number" name="awb" value={editableOrder.awb} />
                 <InfoRow label="Agent Name" name="agentName" value={editableOrder.agentId?.name || "Unassigned"} />
                 <div style={{ paddingTop: "12px", borderTop: "1px dashed #f1f5f9" }}>
                    <span style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", textTransform:"uppercase" }}>Remarks</span>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#334155" }}>{editableOrder.remarks || "No remarks provided."}</p>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: FINANCIALS */}
           <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Payment Summary Card */}
              <div style={styles.card}>
                 <div style={styles.cardHeader}>💳 Payment Summary</div>
                 
                 <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>TOTAL AMOUNT</span>
                    <span style={{ fontSize: "20px", color: "#0f172a", fontWeight: "800" }}>₹{editableOrder.totalAmount?.toLocaleString()}</span>
                 </div>

                 <div style={styles.fieldRow}>
                    <span style={styles.label}>Payment Mode</span>
                    {isEditing ? (
                       <div style={{ width: "60%" }}>
                         <select style={styles.input} name="paymentMode" value={editableOrder.paymentMode} onChange={handleInputChange}>
                            <option value="COD">COD</option><option value="Full Payment">Full Payment</option><option value="Partial Payment">Partial Payment</option>
                         </select>
                       </div>
                    ) : (
                       <span style={styles.badge(editableOrder.paymentMode)}>{editableOrder.paymentMode}</span>
                    )}
                 </div>

                 <div style={styles.fieldRow}>
                    <span style={styles.label}>Payment Status</span>
                    {isEditing ? (
                       <div style={{ width: "60%" }}>
                        <select style={styles.input} name="paymentStatus" value={editableOrder.paymentStatus} onChange={handleInputChange}>
                           <option>Pending</option><option>Paid</option><option>Failed</option>
                        </select>
                       </div>
                    ) : (
                       <span style={styles.badge(editableOrder.paymentStatus)}>{editableOrder.paymentStatus}</span>
                    )}
                 </div>

                 {/* --- CONDITIONAL LOGIC FOR PARTIAL --- */}
                 {editableOrder.paymentMode === "Partial Payment" && (
                    <div style={{ marginTop: "12px", background: "#f0f9ff", padding: "16px", borderRadius: "10px", border: "1px dashed #bae6fd" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                           <span style={{ fontSize: "13px", color: "#0369a1", fontWeight: "600" }}>Deposited (Paid)</span>
                           {isEditing ? (
                               <input style={{...styles.input, width: "80px", background:"white" }} type="number" name="depositedAmount" value={editableOrder.depositedAmount} onChange={handleInputChange} />
                           ) : (
                               <span style={{ color: "#0284c7", fontWeight: "700" }}>₹{editableOrder.depositedAmount?.toLocaleString()}</span>
                           )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <span style={{ fontSize: "13px", color: "#b91c1c", fontWeight: "600" }}>Remaining (Due)</span>
                           {isEditing ? (
                               <input style={{...styles.input, width: "80px", background:"white" }} type="number" name="remainingAmount" value={editableOrder.remainingAmount} onChange={handleInputChange} />
                           ) : (
                               <span style={{ color: "#dc2626", fontWeight: "700" }}>₹{editableOrder.remainingAmount?.toLocaleString()}</span>
                           )}
                        </div>
                    </div>
                 )}
              </div>

              {/* Items Card */}
              <div style={styles.card}>
                 <div style={styles.cardHeader}>📦 Order Items</div>
                 <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ height: "50px", width: "50px", background: "#f1f5f9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🛍️</div>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Product ID: {editableOrder.productId?._id?.slice(-6) || "N/A"}</div>
                       <div style={{ fontSize: "12px", color: "#64748b" }}>Unit Price: ₹{editableOrder.priceAtOrderTime}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                       <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>QTY: {editableOrder.quantity}</div>
                       <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>₹{editableOrder.totalAmount}</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- FOOTER --- */}
        <div style={styles.footer}>
           {isEditing ? (
              <>
                <button style={styles.btn("secondary")} onClick={() => { setIsEditing(false); setEditableOrder(order); }}>Cancel</button>
                <button style={styles.btn("primary")} onClick={handleSave}>Save Changes</button>
              </>
           ) : (
              <>
                <button style={styles.btn("secondary")} onClick={onClose}>Close</button>
                <button style={styles.btn("primary")} onClick={() => setIsEditing(true)}>Edit Order</button>
              </>
           )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;