import React, { useState } from "react";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // 1. STATE for Editing
  const [isEditing, setIsEditing] = useState(false);
  // Use a copy of the prop data for local editing state
  const [editableOrder, setEditableOrder] = useState(order); 

  // --- Utility Functions ---

  // 2. Helper: Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // 3. Helper: Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // 4. Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested fields like agentId.name
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditableOrder(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditableOrder(prev => ({ ...prev, [name]: value }));
    }
  };

  // 5. Save/Cancel Handlers
  const handleSave = () => {
    // 💡 Placeholder for actual API call
    console.log("Saving changes:", editableOrder);
    alert("Order updated successfully! (Simulated)");
    
    // ⚠️ In a real application, you would:
    // 1. Call your backend API with the 'editableOrder' data.
    // 2. Await the response.
    // 3. If successful, update the main 'order' state in the parent component
    //    or refetch the data.
    // 4. Then, set isEditing(false);

    setIsEditing(false); // Exit editing mode
  };

  const handleCancel = () => {
    // Revert the local state back to the original prop data
    setEditableOrder(order); 
    setIsEditing(false); // Exit editing mode
  };
  
  // 6. Mock Invoice Download Function
  const handleDownloadInvoice = () => {
    alert(`Downloading invoice for Order #${editableOrder._id}...`);
  };

  // --- Styles (Moved inside to access isEditing for dynamic styles if needed) ---
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
      display: "flex", justifyContent: "space-between", alignItems: "center",
      gap: "10px"
    },
    label: { 
      fontSize: "11px", color: "#64748b", textTransform: "uppercase", 
      fontWeight: "700", letterSpacing: "0.5px", marginBottom: "4px", display: "block" 
    },
    value: { 
      fontSize: "14px", color: "#0f172a", fontWeight: "500", margin: 0,
      lineHeight: "1.5" 
    },
    input: {
      width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", 
      borderRadius: "6px", fontSize: "14px", color: "#0f172a", 
      outline: "none", transition: "border-color 0.2s",
      backgroundColor: isEditing ? "white" : "#f8fafc" // Highlight non-editable
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

  // --- Reusable Editable Field Component ---
  const EditableField = ({ label, value, name, type = "text", isTextArea = false }) => (
    <div style={{ marginBottom: "16px" }}>
      <span style={styles.label}>{label}</span>
      {isEditing ? (
        isTextArea ? (
          <textarea 
            name={name} 
            value={value || ''} 
            onChange={handleInputChange} 
            style={{ ...styles.input, height: "80px" }}
          />
        ) : (
          <input 
            type={type} 
            name={name} 
            value={value || ''} 
            onChange={handleInputChange} 
            style={styles.input}
          />
        )
      ) : (
        <p style={styles.value}>{value}</p>
      )}
    </div>
  );

  // --- Reusable ReadOnly Field Component ---
  const ReadOnlyField = ({ label, value, isCurrency = false, isDate = false }) => (
    <div>
      <span style={styles.label}>{label}</span>
      <p style={{ 
        ...styles.value, 
        ...(isCurrency && { fontSize: "16px", fontWeight: "700" }) 
      }}>
        {isCurrency ? formatCurrency(value) : isDate ? formatDate(value) : value}
      </p>
    </div>
  );
  
  // --- Render Component ---
  return (
    <div style={styles.overlay} onClick={(e) => { if(e.target === e.currentTarget && !isEditing) onClose() }}>
      <div style={styles.modal}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
              Order Details {isEditing && <span style={{ fontSize: "12px", color: "#f97316", marginLeft: "10px", background: "#fef3c7", padding: "4px 8px", borderRadius: "4px" }}>EDITING MODE</span>}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>ID:</span>
              <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", color: "#475569" }}>
                {editableOrder._id}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "24px", color: "#94a3b8", cursor: "pointer" }}>&times;</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          
          {/* SECTION 1: Product & Financials (Mostly ReadOnly) */}
          <div style={styles.sectionTitle}>📦 Order Information</div>
          <div style={styles.gridTwo}>
            <ReadOnlyField label="Product ID" value={editableOrder.productId?._id || "Unknown Product"} />
            <ReadOnlyField label="Order Date" value={editableOrder.createdAt} isDate />
          </div>

          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "32px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <EditableField 
                   label="Quantity" 
                   value={editableOrder.quantity} 
                   name="quantity" 
                   type="number"
                />
                <ReadOnlyField label="Price / Unit (Order Time)" value={editableOrder.priceAtOrderTime} isCurrency />
                <ReadOnlyField label="Total Amount" value={editableOrder.totalAmount} isCurrency />
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.gridTwo}>
            {/* SECTION 2: Customer & Agent */}
            <div>
              <div style={styles.sectionTitle}>👤 Customer Details</div>
              <EditableField label="Name" value={editableOrder.customerName} name="customerName" />
              <EditableField label="Phone" value={editableOrder.phone} name="phone" />
              <EditableField label="Address" value={editableOrder.address} name="address" />
              <EditableField label="Pincode" value={editableOrder.pincode} name="pincode" />
            </div>

            {/* SECTION 3: Status & Shipping */}
            <div>
              <div style={styles.sectionTitle}>🚚 Status & Shipping</div>
              <div style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
                 <div>
                    <span style={styles.label}>Order Status</span>
                    {isEditing ? (
                      <select 
                        name="orderStatus" 
                        value={editableOrder.orderStatus} 
                        onChange={handleInputChange} 
                        style={styles.input}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                       <span style={styles.statusTag(editableOrder.orderStatus)}>{editableOrder.orderStatus}</span>
                    )}
                 </div>
                 <div>
                    <span style={styles.label}>Payment Status</span>
                    {isEditing ? (
                      <select 
                        name="paymentStatus" 
                        value={editableOrder.paymentStatus} 
                        onChange={handleInputChange} 
                        style={styles.input}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    ) : (
                      <span style={{ 
                        color: editableOrder.paymentStatus === "Paid" ? "#16a34a" : "#d97706", 
                        fontWeight: "600", fontSize: "14px"
                      }}>{editableOrder.paymentStatus}</span>
                    )}
                 </div>
              </div>
              
              <EditableField label="Payment Mode" value={editableOrder.paymentMode} name="paymentMode" />

              <EditableField label="AWB Number" value={editableOrder.awb} name="awb" />

              {editableOrder.agentId && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#f0f9ff", borderRadius: "6px" }}>
                   <span style={{...styles.label, color: "#0369a1"}}>Managed By Agent</span>
                   <EditableField label="Agent Name" value={editableOrder.agentId.name} name="agentId.name" />
                   <EditableField label="Agent Email" value={editableOrder.agentId.email} name="agentId.email" />
                </div>
              )}
            </div>
          </div>
          
           {/* Remarks Section */}
           <EditableField label="Remarks" value={editableOrder.remarks} name="remarks" isTextArea />

        </div>

        {/* Footer */}
        <div style={styles.footer}>
          
          <button 
            onClick={onClose}
            style={{ padding: "10px 24px", border: "1px solid #cbd5e1", background: "white", borderRadius: "8px", fontWeight: "600", color: "#475569", cursor: "pointer" }}
          >
            Close
          </button>
          
          <div style={{ display: "flex", gap: "10px" }}>
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  style={{ 
                    padding: "10px 24px", 
                    border: "1px solid #fca5a5", 
                    background: "#fee2e2", 
                    borderRadius: "8px", 
                    fontWeight: "600", 
                    color: "#dc2626", 
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  style={{ 
                    padding: "10px 24px", 
                    border: "none", 
                    background: "#16a34a", 
                    borderRadius: "8px", 
                    fontWeight: "500", 
                    color: "white", 
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    display: "flex", alignItems: "center", gap: "8px"
                  }}
                >
                  <span>💾</span> Save Changes
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{ 
                    padding: "10px 24px", 
                    border: "1px solid #a5b4fc", 
                    background: "#e0e7ff", 
                    borderRadius: "8px", 
                    fontWeight: "600", 
                    color: "#4f46e5", 
                    cursor: "pointer"
                  }}
                >
                  ✏️ Edit Details
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
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;