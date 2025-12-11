import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Tag,
  Package,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  User,
  Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetailsModal = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  // Reset selected image when product changes
  useEffect(() => {
    if (product) setSelectedImage(0);
  }, [product]);

  if (!product) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(product._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 25 } 
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  };

  const currentImage = product.images?.[selectedImage]?.url || product.images?.[0]?.url || 'https://via.placeholder.com/400';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ring-1 ring-slate-900/5"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-none">Product Overview</h2>
                <span className="text-xs text-slate-500 font-medium">{product.category || 'Uncategorized'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-slate-200">
              
              {/* Left Column: Visuals (5 Columns) */}
              <div className="lg:col-span-5 p-6 space-y-6 bg-white">
                {/* Main Image */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm relative group">
                   <motion.img
                      key={currentImage} // Triggers animation on change
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      src={currentImage}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Badge Overlay */}
                    <div className="absolute top-4 left-4">
                      {product.status === 'active' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-sm backdrop-blur-md">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/90 text-white text-xs font-bold shadow-sm backdrop-blur-md">
                          <AlertCircle className="w-3.5 h-3.5" /> {product.status}
                        </span>
                      )}
                    </div>
                </div>

                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === idx 
                            ? "border-indigo-600 ring-2 ring-indigo-100" 
                            : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details (7 Columns) */}
              <div className="lg:col-span-7 p-6 lg:p-8 space-y-8 bg-slate-50/30">
                
                {/* Title & Price Header */}
                <div className="space-y-4">
                   <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                    {product.productName}
                  </h1>
                  
                  {/* Key Stats Card */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Price</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">${product.offerPrice || product.price}</span>
                        {product.offerPrice && product.offerPrice < product.price && (
                          <span className="text-sm font-medium text-slate-400 line-through decoration-slate-400/50">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                       <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Box className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Inventory</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold ${product.stock < 10 ? 'text-amber-600' : 'text-slate-900'}`}>
                          {product.stock}
                        </span>
                        <div className={`h-2 flex-1 mx-3 rounded-full bg-slate-100 overflow-hidden`}>
                           <div 
                              className={`h-full rounded-full ${product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min(product.stock, 100)}%` }}
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    Description
                  </h3>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200/60">
                    {product.description || "No description provided for this product."}
                  </div>
                </div>

                {/* Technical Metadata */}
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    System Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {/* ID Row */}
                    <div className="group flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
                           <Tag className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-400 font-semibold uppercase">Product ID</span>
                           <span className="text-xs font-mono text-slate-700 max-w-[120px] truncate">{product._id}</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleCopyId}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors relative"
                        title="Copy ID"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500"/> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Creator Row */}
                     <div className="flex items-center p-2.5 rounded-lg bg-white border border-slate-200">
                       <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
                           <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-400 font-semibold uppercase">Created By</span>
                           <span className="text-xs font-medium text-slate-700">
                              {product.createdBy?.name || "Unknown Admin"}
                           </span>
                        </div>
                      </div>
                    </div>

                    {/* Date Row */}
                    <div className="flex items-center gap-3 px-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div className="flex flex-col">
                         <span className="text-[10px] text-slate-400 font-semibold">Added on</span>
                         <span className="text-sm font-medium text-slate-700">
                           {product.createdAt ? new Date(product.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium'}) : 'N/A'}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 z-10">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm"
            >
              Close Details
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetailsModal;