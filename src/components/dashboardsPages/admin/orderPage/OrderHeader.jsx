import React, { useState } from "react";
import { Plus, Sparkles, ShoppingBag } from "lucide-react";

const OrderHeader = ({ onAddClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    container: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "20px",
      paddingBottom: "24px",
      borderBottom: "1px solid #e2e8f0",
      marginBottom: "30px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    titleGroup: {
      maxWidth: "600px"
    },
    h1: {
      fontSize: "30px",
      fontWeight: "800",
      color: "#0f172a", // Slate 900
      margin: "0 0 8px 0",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      letterSpacing: "-0.5px"
    },
    p: {
      fontSize: "14px",
      color: "#64748b", // Slate 500
      lineHeight: "1.6",
      margin: 0
    },
    button: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: "600",
      color: "white",
      backgroundColor: isHovered ? "#1e293b" : "#0f172a", // Slate 800 hover : Slate 900
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: isHovered 
        ? "0 10px 15px -3px rgba(15, 23, 42, 0.2)" 
        : "0 4px 6px -1px rgba(15, 23, 42, 0.1)",
      transition: "all 0.3s ease",
      transform: isHovered ? "scale(1.02)" : "scale(1)"
    },
    iconBox: {
      background: "#1e293b", // Slate 800
      borderRadius: "6px",
      padding: "4px",
      display: "flex",
      border: "1px solid #334155"
    },
    sparkle: {
      opacity: isHovered ? 1 : 0,
      transform: isHovered ? "translateX(0)" : "translateX(-10px)",
      transition: "all 0.3s ease",
      width: "16px",
      height: "16px",
      color: "#facc15" // Yellow 400
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side: Title & Description */}
      <div style={styles.titleGroup}>
        <h1 style={styles.h1}>
          <ShoppingBag size={28} color="#0f172a" />
          Orders Overview
        </h1>
        <p style={styles.p}>
          Manage your order pipeline efficiently. Track incoming orders, check payment statuses, 
          and download invoices in real-time.
        </p>
      </div>

      {/* Right Side: Primary Action Button */}
      <button
        onClick={onAddClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={styles.button}
      >
        {/* Icon Container */}
        <div style={styles.iconBox}>
          <Plus size={16} color="#60a5fa" /> {/* Blue 400 */}
        </div>
        
        <span>Create New Order</span>
        
        {/* Sparkle Animation */}
        <div style={{ width: "16px", overflow: "visible" }}>
           <Sparkles style={styles.sparkle} />
        </div>
      </button>
    </div>
  );
};

export default OrderHeader;