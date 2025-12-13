import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../../../store/authStore";
import api from "../../../../api/api"; 

const AddNewOrder = ({ onClose, onSuccess }) => {
  const { user: authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for Dropdowns
  const [products, setProducts] = useState([]);
  const [agents, setAgents] = useState([]);

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    pincode: "",
    productId: "", // This will store the _id
    quantity: 1,
    priceAtOrderTime: "",
    agentId: "",   // This will store the _id
    paymentMode: "COD",
    remarks: ""
  });

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, userRes] = await Promise.all([
           axios.get(api.Product.GetAll, { headers: { Authorization: `Bearer ${authUser?.token}` } }),
           axios.get(api.User.GetAllUsers || api.User.GetAll, { headers: { Authorization: `Bearer ${authUser?.token}` } })
        ]);

        // Debugging: Check console to see what the product field is actually called
        console.log("Products Fetched:", productRes.data.data); 

        setProducts(productRes.data.data || []);
        setAgents(userRes.data.data || []); 

      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Failed to load products or agents list.");
      }
    };
    fetchData();
  }, [authUser]);

  // 2. Handle Product Selection
  // Sets the ID to state, but finds the price from the object
  const handleProductChange = (e) => {
    const selectedId = e.target.value; // This is the _id
    
    const selectedProduct = products.find(p => p._id === selectedId);
    
    setFormData(prev => ({
      ...prev,
      productId: selectedId, // Stores ID for submission
      // Auto-fill price if product found
      priceAtOrderTime: selectedProduct ? selectedProduct.price : prev.priceAtOrderTime
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!formData.customerName.trim()) return "Customer Name is required.";
    if (!phoneRegex.test(formData.phone)) return "Invalid Phone Number.";
    if (!formData.address.trim()) return "Address is required.";
    if (!pincodeRegex.test(formData.pincode)) return "Invalid Pincode.";
    if (!formData.productId.trim()) return "Product is required.";
    if (!formData.agentId.trim()) return "Agent is required.";
    if (!formData.priceAtOrderTime) return "Price is required.";
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Debugging: Verify that IDs are being sent, not names
    console.log("Submitting Data:", formData); 

    try {
      setLoading(true);
      const token = authUser?.token;
      await axios.post(api.Order.Create, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onSuccess) onSuccess(); 
      onClose(); 
    } catch (err) {
      console.error("Create Order Error:", err);
      const serverMsg = err.response?.data?.errors 
        ? (Array.isArray(err.response.data.errors) ? err.response.data.errors.join(", ") : err.response.data.errors)
        : err.response?.data?.message || "Failed to create order.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const styles = {
    overlay: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(8px)",
      zIndex: 1100,
      display: "flex", justifyContent: "center", alignItems: "center",
      animation: "fadeIn 0.2s ease-out"
    },
    modal: {
      background: "#ffffff",
      width: "95%", maxWidth: "650px",
      borderRadius: "20px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      maxHeight: "90vh",
      fontFamily: '"Inter", sans-serif'
    },
    header: {
      padding: "24px 32px", 
      borderBottom: "1px solid #f1f5f9",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "linear-gradient(to right, #f8fafc, #ffffff)"
    },
    headerTitle: {
      fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0
    },
    closeButton: {
      background: "#f1f5f9", border: "none", borderRadius: "50%",
      width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "18px", color: "#64748b", cursor: "pointer"
    },
    body: { padding: "32px", overflowY: "auto" },
    footer: {
      padding: "24px 32px", borderTop: "1px solid #f1f5f9", 
      background: "#fff", display: "flex", justifyContent: "flex-end", gap: "12px"
    },
    sectionTitle: { 
      fontSize: "12px", fontWeight: "700", color: "#94a3b8", 
      marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" 
    },
    inputGroup: { marginBottom: "20px" },
    label: { 
      display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px" 
    },
    input: {
      width: "100%", padding: "12px 16px", borderRadius: "8px",
      border: "1px solid #e2e8f0", fontSize: "14px", color: "#0f172a",
      outline: "none", backgroundColor: "#f8fafc"
    },
    gridTwo: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
    errorBox: {
      marginBottom: "24px", padding: "12px 16px", 
      background: "#fef2f2", border: "1px solid #fee2e2", 
      color: "#991b1b", borderRadius: "8px", fontSize: "14px", fontWeight: "500",
    },
    primaryBtn: {
      padding: "12px 24px", borderRadius: "10px", border: "none", 
      background: loading ? "#94a3b8" : "#2563eb", 
      color: "white", fontWeight: "600", fontSize: "14px", cursor: "pointer"
    },
    secondaryBtn: {
      padding: "12px 24px", borderRadius: "10px", 
      border: "1px solid #e2e8f0", background: "white", 
      color: "#475569", fontWeight: "600", fontSize: "14px", cursor: "pointer"
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Create New Order</h2>
          <button onClick={onClose} style={styles.closeButton}>&times;</button>
        </div>

        <div style={styles.body}>
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <form id="create-order-form" onSubmit={handleSubmit}>
            
            <div style={styles.sectionTitle}>Customer Information</div>
            <div style={styles.gridTwo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Customer Name *</label>
                <input style={styles.input} name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Enter full name" />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input style={styles.input} name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" maxLength={10} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Shipping Address *</label>
              <input style={styles.input} name="address" value={formData.address} onChange={handleChange} placeholder="House No, Street, Landmark" />
            </div>

            <div style={styles.gridTwo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pincode *</label>
                <input style={styles.input} name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 560001" maxLength={6} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Payment Mode</label>
                <select style={{ ...styles.input, cursor: "pointer" }} name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                  <option value="COD">COD (Cash on Delivery)</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>
            </div>

            <div style={{ height: "1px", background: "#f1f5f9", margin: "10px 0 24px 0" }}></div>

            <div style={styles.sectionTitle}>Order Details</div>
            <div style={styles.gridTwo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Product *</label>
                
                {/* KEY CHANGE: The value is the ID, so ID is sent. 
                   The display checks for name, title, or productName. 
                */}
                <select 
                  style={{ ...styles.input, cursor: "pointer" }} 
                  name="productId" 
                  value={formData.productId} 
                  onChange={handleProductChange}
                >
                  <option value="">-- Select a Product --</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name || prod.title || prod.productName || "Unnamed Product"} 
                    </option>
                  ))}
                </select>

              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Quantity</label>
                <input style={styles.input} type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} />
              </div>
            </div>

            <div style={styles.gridTwo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price (At Order Time) *</label>
                <input style={styles.input} type="number" name="priceAtOrderTime" value={formData.priceAtOrderTime} onChange={handleChange} placeholder="0.00" />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Agent *</label>
                <select 
                  style={{ ...styles.input, cursor: "pointer" }} 
                  name="agentId" 
                  value={formData.agentId} 
                  onChange={handleChange}
                >
                  <option value="">-- Select an Agent --</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name || agent.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Remarks (Optional)</label>
              <textarea style={{ ...styles.input, height: "80px", resize: "none" }} name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Any special instructions..." />
            </div>
          </form>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.secondaryBtn}>Cancel</button>
          <button type="submit" form="create-order-form" disabled={loading} style={styles.primaryBtn}>
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewOrder;