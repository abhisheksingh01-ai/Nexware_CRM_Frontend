import React, { useState, useEffect } from "react";

const OrderDetailsModal = ({ order, onClose }) => {
  // Reset state when a new order is passed prop
  const [isEditing, setIsEditing] = useState(false);
  const [editableOrder, setEditableOrder] = useState(order);

  useEffect(() => {
    setEditableOrder(order);
    setIsEditing(false);
  }, [order]);

  if (!order) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested agent updates or flat updates
    setEditableOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving:", editableOrder);
    alert("Saved successfully (Mock)");
    setIsEditing(false);
    // Here you would trigger an API call to PUT/PATCH the order
  };

  // Styles
  const styles = {
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" },
    modal: { background: "white", borderRadius: "16px", width: "90%", maxWidth: "700px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
    header: { padding: "20px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderRadius: "16px 16px 0 0" },
    body: { padding: "32px", overflowY: "auto" },
    footer: { padding: "20px 32px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" },
    label: { fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px", display: "block" },
    value: { fontSize: "14px", color: "#0f172a", fontWeight: "500", margin: 0 },
    input: { width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px" }
  };

  const Field = ({ label, value, name }) => (
    <div style={{ marginBottom: "16px" }}>
      <span style={styles.label}>{label}</span>
      {isEditing ? (
        <input style={styles.input} name={name} value={value || ""} onChange={handleInputChange} />
      ) : (
        <p style={styles.value}>{value || "N/A"}</p>
      )}
    </div>
  );

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
            Order Details <span style={{ color: "#94a3b8", fontWeight: "400" }}>#{editableOrder._id?.slice(-6)}</span>
          </h2>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "24px", cursor: "pointer", color: "#64748b" }}>&times;</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <Field label="Customer Name" value={editableOrder.customerName} name="customerName" />
            <Field label="Phone" value={editableOrder.phone} name="phone" />
            <Field label="Total Amount" value={`₹${editableOrder.totalAmount}`} name="totalAmount" />
            
            <div>
              <span style={styles.label}>Status</span>
              {isEditing ? (
                <select style={styles.input} name="orderStatus" value={editableOrder.orderStatus} onChange={handleInputChange}>
                  <option>Pending</option><option>Confirmed</option><option>Delivered</option><option>Cancelled</option>
                </select>
              ) : (
                <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{editableOrder.orderStatus}</span>
              )}
            </div>
          </div>
          <Field label="Address" value={editableOrder.address} name="address" />
        </div>

        {/* Footer */}
        <div style={styles.footer}>
           <button onClick={onClose} style={{ padding: "8px 16px", border: "1px solid #cbd5e1", background: "white", borderRadius: "6px", cursor: "pointer" }}>Close</button>
           {isEditing ? (
             <button onClick={handleSave} style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Save Changes</button>
           ) : (
             <button onClick={() => setIsEditing(true)} style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit Order</button>
           )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;