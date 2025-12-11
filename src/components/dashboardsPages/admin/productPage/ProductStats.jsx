// components/product/ProductStats.jsx
import React, { useMemo } from "react";
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { motion } from "framer-motion";

// --- DUMMY DATA FOR TESTING (Matches your Schema) ---
const DUMMY_PRODUCTS = [
  { productName: "Gaming Mouse", price: 50, stock: 120, status: "active", category: "Electronics" },
  { productName: "Mechanical Keyb", price: 150, stock: 5, status: "active", category: "Electronics" },
  { productName: "Office Chair", price: 300, stock: 0, status: "outofstock", category: "Furniture" },
  { productName: "Desk Lamp", price: 45, stock: 50, status: "active", category: "Furniture" },
  { productName: "USB Hub", price: 20, stock: 200, status: "inactive", category: "Electronics" },
];

const ProductStats = ({ products = DUMMY_PRODUCTS }) => {

  // --- Calculate Real Stats from Data ---
  const stats = useMemo(() => {
    // 1. Total Inventory Value (Price * Stock)
    const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
    
    // 2. Low Stock Count (Threshold < 10 and not 0)
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
    
    // 3. Out of Stock Count
    const outOfStockCount = products.filter(p => p.stock === 0 || p.status === 'outofstock').length;

    // 4. Active Products
    const activeCount = products.filter(p => p.status === 'active').length;

    return [
      { 
        label: "Total Inventory Value", 
        val: `$${totalValue.toLocaleString()}`, 
        change: "+5%", // Mock trend
        icon: DollarSign, 
        color: "emerald",
        trend: "up"
      },
      { 
        label: "Total Products", 
        val: products.length, 
        change: `${activeCount} Active`, 
        icon: Package, 
        color: "blue",
        trend: "neutral"
      },
      { 
        label: "Low Stock Alert", 
        val: lowStockCount, 
        change: "Restock Now", 
        icon: AlertTriangle, 
        color: "amber",
        trend: "down" // Down is usually bad, but here it draws attention
      },
      { 
        label: "Out of Stock", 
        val: outOfStockCount, 
        change: "Lost Sales", 
        icon: Layers, 
        color: "rose", // Red for danger/empty
        trend: "down"
      },
    ];
  }, [products]);

  // --- Animations ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6"
    >
      {stats.map((stat, idx) => {
        // Color Styles Configuration
        const colorStyles = {
          blue: "bg-blue-50 text-blue-600 border-blue-100",
          emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
          amber: "bg-amber-50 text-amber-600 border-amber-100",
          rose: "bg-rose-50 text-rose-600 border-rose-100",
        };

        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              {/* Icon Box */}
              <div className={`p-3 rounded-xl ${colorStyles[stat.color]} border`}>
                <stat.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>

              {/* Trend/Info Badge */}
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100`}>
                {stat.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                {stat.trend === "down" && <TrendingDown className="w-3 h-3 text-rose-500" />}
                {stat.trend === "neutral" && <TrendingUp className="w-3 h-3 text-blue-500" />}
                {stat.change}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {stat.val}
              </h3>
            </div>

            {/* Decorative Background Blob (Appears on Hover) */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${colorStyles[stat.color].split(" ")[0].replace("bg-", "bg-")}`} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProductStats;