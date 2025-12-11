// components/product/ProductDetailsModal.jsx
import React from "react";
import { 
  X, 
  Calendar, 
  Tag, 
  Layers, 
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetailsModal = ({ product, onClose }) => {
  
  if (!product) return null;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.5 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Product Details</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {product._id}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Images Section */}
                <div className="space-y-4">
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative group">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} 
                      alt={product.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {product.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.images.map((img, idx) => (
                        <div key={idx} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:border-blue-500 transition-colors">
                          <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  
                  {/* Status Badge */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {product.category}
                      </span>
                      {product.status === 'active' ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                          <AlertCircle className="w-3 h-3" /> {product.status}
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                      {product.productName}
                    </h1>
                  </div>

                  {/* Info Cards */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Pricing
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">${product.offerPrice || product.price}</span>
                        {product.offerPrice && product.offerPrice < product.price && (
                          <span className="text-sm text-slate-400 line-through">${product.price}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-px bg-slate-200 hidden sm:block"></div>
                    
                    <div className="flex-1">
                       <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Inventory
                      </p>
                      <p className={`text-lg font-bold ${product.stock === 0 ? 'text-red-500' : 'text-slate-900'}`}>
                        {product.stock} <span className="text-sm font-medium text-slate-500">Units</span>
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Created At</span>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Slug</span>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span className="truncate max-w-[150px]">{product.slug}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                Close
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;