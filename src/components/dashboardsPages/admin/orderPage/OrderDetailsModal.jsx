import React, { useState, useEffect } from "react";

const OrderDetailsModal = ({ order, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableOrder, setEditableOrder] = useState(null);

  // Sync props to state
  useEffect(() => {
    if (order) {
      setEditableOrder(order);
    }
  }, [order]);

  if (!editableOrder) return null;

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Save (Mock)
  const handleSave = () => {
    console.log("Saving Updated Order:", editableOrder);
    // Add your API update logic here (e.g., axios.put...)
    setIsEditing(false);
    alert("Order updated successfully!");
  };

  // Handle Invoice Download (Print View)
  const handleDownloadInvoice = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - #${editableOrder._id.slice(-6)}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #2563eb; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
            .value { font-size: 14px; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f8fafc; }
            .total-row { font-weight: bold; background-color: #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">INVOICE</div>
              <div class="value">Order #${editableOrder._id}</div>
              <div class="value">Date: ${new Date(editableOrder.createdAt).toLocaleDateString()}</div>
            </div>
            <div style="text-align: right;">
              <div class="label">Billed To</div>
              <div class="value">${editableOrder.customerName}</div>
              <div class="value">${editableOrder.phone}</div>
              <div class="value">${editableOrder.address}, ${editableOrder.pincode}</div>
            </div>
          </div>

          <h3>Order Summary</h3>
          <table>
            <thead>
              <tr><th>Item/Product ID</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Product ID: ${editableOrder.productId?._id || "N/A"}</td>
                <td>${editableOrder.quantity}</td>
                <td>₹${editableOrder.priceAtOrderTime}</td>
                <td>₹${editableOrder.totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
            <div style="width: 250px;">
               <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                 <span>Subtotal:</span> <span>₹${editableOrder.totalAmount}</span>
               </div>
               ${editableOrder.paymentMode === "Partial Payment" ? `
               <div style="display:flex; justify-content:space-between; margin-bottom:8px; color: green;">
                 <span>Deposited:</span> <span>- ₹${editableOrder.depositedAmount}</span>
               </div>
               <div style="display:flex; justify-content:space-between; font-weight:bold; border-top:1px solid #ddd; padding-top:8px;">
                 <span>Remaining Due:</span> <span>₹${editableOrder.remainingAmount}</span>
               </div>
               ` : `
               <div style="display:flex; justify-content:space-between; font-weight:bold; border-top:1px solid #ddd; padding-top:8px;">
                 <span>Total Paid:</span> <span>₹${editableOrder.totalAmount}</span>
               </div>
               `}
            </div>
          </div>
          
          <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
            Thank you for your business!
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
      backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(6px)",
      zIndex: 1100, display: "flex", justifyContent: "center", alignItems: "center",
      animation: "fadeIn 0.2s ease-out"
    },
    modal: {
      background: "#ffffff", borderRadius: "20px", width: "95%", maxWidth: "800px",
      maxHeight: "90vh", display: "flex", flexDirection: "column",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", overflow: "hidden",
      fontFamily: '"Inter", sans-serif'
    },
    header: {
      padding: "24px 32px", borderBottom: "1px solid #f1f5f9",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "#f8fafc"
    },
    headerTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 },
    btnIcon: {
      background: "transparent", border: "1px solid #e2e8f0", borderRadius: "8px",
      padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
      fontSize: "13px", fontWeight: "600", color: "#475569", transition: "0.2s"
    },
    closeBtn: {
      border: "none", background: "transparent", fontSize: "24px", cursor: "pointer", color: "#94a3b8"
    },
    body: { padding: "32px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" },
    section: { gridColumn: "span 1" },
    fullWidth: { gridColumn: "span 2" },
    sectionTitle: {
      fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase",
      marginBottom: "16px", letterSpacing: "1px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px"
    },
    fieldGroup: { marginBottom: "16px" },
    label: { display: "block", fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px" },
    value: { fontSize: "14px", color: "#1e293b", fontWeight: "500" },
    input: {
      width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px",
      fontSize: "14px", color: "#0f172a", outline: "none", transition: "border 0.2s"
    },
    badge: (type, status) => {
      const colors = {
        Paid: "#dcfce7", Pending: "#ffedd5", Failed: "#fee2e2",
        Delivered: "#dcfce7", Cancelled: "#fee2e2", Shipped: "#e0f2fe", Partial: "#fff7ed"
      };
      const textColors = {
        Paid: "#166534", Pending: "#9a3412", Failed: "#991b1b",
        Delivered: "#15803d", Cancelled: "#991b1b", Shipped: "#075985", Partial: "#c2410c"
      };
      const key = status?.includes("Partial") ? "Partial" : status;
      return {
        backgroundColor: colors[key] || "#f1f5f9",
        color: textColors[key] || "#475569",
        padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", display: "inline-block"
      };
    },
    footer: {
      padding: "20px 32px", borderTop: "1px solid #f1f5f9", background: "#ffffff",
      display: "flex", justifyContent: "flex-end", gap: "12px"
    },
    btnSecondary: {
      padding: "10px 20px", border: "1px solid #cbd5e1", background: "white",
      color: "#475569", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
    },
    btnPrimary: {
      padding: "10px 20px", border: "none", background: "#2563eb",
      color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
    }
  };

  // Reusable Field Component
  const DetailField = ({ label, name, value, type = "text", fullWidth = false }) => (
    <div style={{ ...styles.fieldGroup, width: fullWidth ? "100%" : "auto" }}>
      <span style={styles.label}>{label}</span>
      {isEditing ? (
        <input style={styles.input} type={type} name={name} value={value} onChange={handleInputChange} />
      ) : (
        <div style={styles.value}>{value || "N/A"}</div>
      )}
    </div>
  );

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={styles.headerTitle}>Order Details</h2>
            <span style={{ fontSize: "14px", color: "#64748b", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px" }}>
              #{editableOrder._id.slice(-6).toUpperCase()}
            </span>
          </div>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button style={styles.btnIcon} onClick={handleDownloadInvoice}>
              ⬇ Download Invoice
            </button>
            <button onClick={onClose} style={styles.closeBtn}>&times;</button>
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>
          
          {/* Section 1: Customer Details */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Customer Information</div>
            <DetailField label="Customer Name" name="customerName" value={editableOrder.customerName} />
            <DetailField label="Phone Number" name="phone" value={editableOrder.phone} />
            <DetailField label="Shipping Address" name="address" value={editableOrder.address} />
            <DetailField label="Pincode" name="pincode" value={editableOrder.pincode} />
          </div>

          {/* Section 2: Order & Product Details */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Order Information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <DetailField label="Product Price" name="priceAtOrderTime" value={editableOrder.priceAtOrderTime} />
              <DetailField label="Quantity" name="quantity" value={editableOrder.quantity} />
            </div>
             <div style={styles.fieldGroup}>
               <span style={styles.label}>Order Status</span>
               {isEditing ? (
                 <select style={styles.input} name="orderStatus" value={editableOrder.orderStatus} onChange={handleInputChange}>
                   <option value="Pending">Pending</option>
                   <option value="Confirmed">Confirmed</option>
                   <option value="Packed">Packed</option>
                   <option value="Shipped">Shipped</option>
                   <option value="Delivered">Delivered</option>
                   <option value="Cancelled">Cancelled</option>
                 </select>
               ) : (
                 <span style={styles.badge('status', editableOrder.orderStatus)}>{editableOrder.orderStatus}</span>
               )}
             </div>
             <div style={styles.fieldGroup}>
                <span style={styles.label}>Date Created</span>
                <div style={styles.value}>{new Date(editableOrder.createdAt).toLocaleString()}</div>
             </div>
          </div>

          {/* Section 3: Payment & Financials */}
          <div style={styles.fullWidth}>
             <div style={styles.sectionTitle}>Payment Details</div>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", background: "#f8fafc", padding: "20px", borderRadius: "12px" }}>
                
                <div style={styles.fieldGroup}>
                  <span style={styles.label}>Payment Mode</span>
                  {isEditing ? (
                    <select style={styles.input} name="paymentMode" value={editableOrder.paymentMode} onChange={handleInputChange}>
                      <option value="COD">COD</option>
                      <option value="Full Payment">Full Payment</option>
                      <option value="Partial Payment">Partial Payment</option>
                    </select>
                  ) : (
                    <div style={{ fontWeight: "600", color: "#0f172a" }}>{editableOrder.paymentMode}</div>
                  )}
                </div>

                <div style={styles.fieldGroup}>
                  <span style={styles.label}>Payment Status</span>
                  {isEditing ? (
                    <select style={styles.input} name="paymentStatus" value={editableOrder.paymentStatus} onChange={handleInputChange}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                  ) : (
                    <span style={styles.badge('payment', editableOrder.paymentStatus)}>{editableOrder.paymentStatus}</span>
                  )}
                </div>

                <div style={styles.fieldGroup}>
                   <span style={styles.label}>Total Amount</span>
                   <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>₹{editableOrder.totalAmount?.toLocaleString()}</div>
                </div>

                {/* --- CONDITIONAL RENDERING FOR PARTIAL PAYMENT --- */}
                {editableOrder.paymentMode === "Partial Payment" && (
                  <>
                    <div style={styles.fieldGroup}>
                      <span style={styles.label}>Deposited Amount</span>
                      {isEditing ? (
                         <input style={styles.input} type="number" name="depositedAmount" value={editableOrder.depositedAmount} onChange={handleInputChange} />
                      ) : (
                        <div style={{ color: "#16a34a", fontWeight: "600" }}>₹{editableOrder.depositedAmount?.toLocaleString()}</div>
                      )}
                    </div>
                    
                    <div style={styles.fieldGroup}>
                      <span style={styles.label}>Remaining Amount</span>
                      {isEditing ? (
                         <input style={styles.input} type="number" name="remainingAmount" value={editableOrder.remainingAmount} onChange={handleInputChange} />
                      ) : (
                        <div style={{ color: "#dc2626", fontWeight: "600" }}>₹{editableOrder.remainingAmount?.toLocaleString()}</div>
                      )}
                    </div>
                  </>
                )}
                {/* ------------------------------------------------ */}
             </div>
          </div>

          {/* Section 4: Logistics & Internal */}
          <div style={styles.fullWidth}>
             <div style={styles.sectionTitle}>Logistics & Internal</div>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <DetailField label="Assigned Agent" name="agentName" value={editableOrder.agentId?.name || "Unassigned"} />
                <DetailField label="AWB Number" name="awb" value={editableOrder.awb} />
                <div style={{ gridColumn: "span 2" }}>
                   <DetailField label="Remarks" name="remarks" value={editableOrder.remarks} fullWidth />
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div style={styles.footer}>
           {isEditing ? (
             <>
               <button onClick={() => { setIsEditing(false); setEditableOrder(order); }} style={styles.btnSecondary}>Cancel</button>
               <button onClick={handleSave} style={{ ...styles.btnPrimary, background: "#16a34a" }}>Save Changes</button>
             </>
           ) : (
             <>
               <button onClick={onClose} style={styles.btnSecondary}>Close</button>
               <button onClick={() => setIsEditing(true)} style={styles.btnPrimary}>Edit Order</button>
             </>
           )}
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;