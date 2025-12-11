// components/product/AddProductModal.jsx
import React, { useState } from "react";
import axios from "axios";
// import api from "../../../../api/api"; // Ensure you have your API endpoints defined
import { useAuthStore } from "../../../../store/authStore";
import {
  X,
  Package,
  DollarSign,
  Tag,
  Layers,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  Loader2,
  Sparkles,
  UploadCloud,
  Percent
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const { user: authUser } = useAuthStore();
  
  // Initial State
  const initialState = {
    productName: "",
    category: "",
    price: "",
    offerPrice: "",
    stock: 0,
    status: "active",
    description: "",
  };

  const [product, setProduct] = useState(initialState);
  const [images, setImages] = useState([]); // Stores the actual File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Stores URL for preview
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status Enum from your Schema
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Out of Stock", value: "outofstock" },
  ];

  // -------------------- HANDLE INPUT CHANGE --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------- HANDLE IMAGE SELECT --------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files]);
      
      // Create previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // -------------------- SUBMIT PRODUCT --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation: Offer Price vs Price
    if (Number(product.offerPrice) > Number(product.price)) {
      alert("Offer price cannot be greater than the main price.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = authUser?.token;
      if (!token) return alert("Unauthorized!");

      // 2. Prepare FormData (Required for File Uploads)
      const formData = new FormData();
      formData.append("productName", product.productName.trim());
      formData.append("category", product.category.trim());
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("stock", product.stock);
      formData.append("status", product.status);
      
      if (product.offerPrice) {
        formData.append("offerPrice", product.offerPrice);
      }

      // Append Images
      images.forEach((image) => {
        formData.append("images", image); 
      });

      // 3. API Call
      // Replace with your actual API endpoint e.g., api.Products.Create
      const res = await axios.post('YOUR_API_ENDPOINT_HERE', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" // Important for files
        },
      });

      onSubmit?.(res.data?.data || res.data);

      // Reset Form
      setProduct(initialState);
      setImages([]);
      setImagePreviews([]);
      onClose();

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.errors?.join(", ") || err.response?.data?.message;
      alert(msg || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation Variants (Same as Lead Modal)
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.95, y: 10 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-500" />
                  Add New Product
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Create a new item in your inventory.
                </p>
              </div>
              <button
                onClick={onClose}
                className="group p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="overflow-y-auto custom-scrollbar p-6">
              <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Product Name" 
                    name="productName" 
                    value={product.productName} 
                    onChange={handleChange} 
                    required 
                    icon={Package} 
                    placeholder="e.g. Wireless Headphones" 
                  />
                  
                  <InputField 
                    label="Category" 
                    name="category" 
                    value={product.category} 
                    onChange={handleChange} 
                    required 
                    icon={Tag} 
                    placeholder="e.g. Electronics" 
                  />
                </div>

                {/* Section: Pricing & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField 
                    label="Regular Price" 
                    name="price" 
                    type="number"
                    value={product.price} 
                    onChange={handleChange} 
                    required 
                    icon={DollarSign} 
                    placeholder="0.00" 
                    min="0"
                  />
                  
                  <InputField 
                    label="Offer Price" 
                    name="offerPrice" 
                    type="number"
                    value={product.offerPrice} 
                    onChange={handleChange} 
                    icon={Percent} 
                    placeholder="0.00" 
                    min="0"
                  />

                  <InputField 
                    label="Stock Quantity" 
                    name="stock" 
                    type="number"
                    value={product.stock} 
                    onChange={handleChange} 
                    icon={Layers} 
                    placeholder="0" 
                    min="0"
                  />
                </div>

                {/* Section: Status & Images */}
                <div className="grid grid-cols-1 gap-5">
                  
                  {/* Status Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={product.status}
                        onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all appearance-none cursor-pointer hover:bg-slate-100"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                      Product Images <span className="text-slate-400 text-[10px] normal-case">(First image is cover)</span>
                    </label>
                    
                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors">
                      <div className="flex flex-col items-center justify-center gap-3">
                        {imagePreviews.length > 0 && (
                          <div className="flex gap-2 mb-2 flex-wrap justify-center">
                            {imagePreviews.map((src, idx) => (
                              <div key={idx} className="relative group/img">
                                <img src={src} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <label className="cursor-pointer flex flex-col items-center">
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-sm font-medium text-slate-600">Click to upload images</span>
                          <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      rows="4"
                      value={product.description}
                      onChange={handleChange}
                      required
                      placeholder="Detailed product description..."
                      className="w-full pl-4 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all resize-none placeholder:text-slate-400"
                    />
                    <FileText className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-product-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Helper Component for consistent inputs
const InputField = ({ label, icon: Icon, required, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-700 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all group-hover:bg-slate-100 group-hover:focus:bg-white"
      />
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
      )}
    </div>
  </div>
);

export default AddProductModal;