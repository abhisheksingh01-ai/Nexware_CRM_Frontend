// components/product/ProductTable.jsx
import React, { useState } from "react";
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Package 
} from "lucide-react";
import ProductDetailsModal from "./ProductDetailsModal";

// --- DUMMY DATA (Matching your Mongoose Schema) ---
const DUMMY_PRODUCTS = [
  {
    _id: "prod_001",
    productName: "Sony WH-1000XM5 Wireless Headphones",
    price: 349.99,
    offerPrice: 299.99,
    stock: 45,
    status: "active",
    category: "Electronics",
    description: "Industry-leading noise cancellation, exceptional sound quality, and crystal-clear hands-free calling. Long battery life up to 30 hours with quick charging.",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=500"
    ],
    createdAt: "2023-10-15T10:00:00Z"
  },
  {
    _id: "prod_002",
    productName: "Herman Miller Aeron Chair",
    price: 1250.00,
    offerPrice: null,
    stock: 0,
    status: "outofstock",
    category: "Furniture",
    description: "The Aeron chair combines a deep knowledge of human-centered design with cutting-edge technology. With over 7 million sold, it has been admired and used by users in 134 countries.",
    images: [
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=500"
    ],
    createdAt: "2023-09-01T08:30:00Z"
  },
  {
    _id: "prod_003",
    productName: "Mechanical Keychron K2",
    price: 89.00,
    offerPrice: 79.00,
    stock: 12,
    status: "active",
    category: "Electronics",
    description: "A super tactile wireless or wired keyboard giving you all the keys and function you need while keeping it compact.",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&q=80&w=500"
    ],
    createdAt: "2023-11-20T14:15:00Z"
  }
];

const ProductTable = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Helper to colorize status
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'outofstock': return 'bg-red-100 text-red-700 border-red-200';
      case 'inactive': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Header / Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DUMMY_PRODUCTS.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Product Name + Image Preview */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400 m-auto mt-2" />
                        )}
                      </div>
                      <span className="font-medium text-slate-900">{product.productName}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600 text-sm">{product.category}</td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">${product.price}</span>
                      {product.offerPrice && (
                        <span className="text-xs text-emerald-600 font-medium">Offer: ${product.offerPrice}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${product.stock < 10 ? 'text-amber-600' : 'text-slate-600'}`}>
                      {product.stock} units
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)} capitalize`}>
                      {product.status}
                    </span>
                  </td>

                  {/* ACTION: The Details Button */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the Modal if a product is selected */}
      <ProductDetailsModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </>
  );
};

export default ProductTable;