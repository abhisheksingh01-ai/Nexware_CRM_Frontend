import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../api/api";
import { useAuthStore } from "../../../../store/authStore";
import {
  MoreHorizontal,
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import ProductDetailsModal from "./ProductDetailsModal";
import EditProductModal from "./EditProductModal"; 

const ProductTable = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [productToEdit, setProductToEdit] = useState(null);    
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 

  const userRole = user?.role || "user";
  const canEdit = userRole === 'admin' || userRole === 'subadmin';
  const canDelete = userRole === 'admin';

  // 1. Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(api.Product.GetAll, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setProducts(Array.isArray(res.data) ? res.data : res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    try {
      await axios.delete(api.Product.AdminDelete, {
        headers: { Authorization: `Bearer ${user?.token}` },
        data: { id: id } 
      });
      setProducts(prev => prev.filter(p => p._id !== id));
      if (selectedProduct?._id === id) {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.message || "Failed to delete product.";
      alert(msg);
    }
  };

  // --- EDIT LOGIC ---
  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleUpdateSuccess = () => {
    fetchProducts(); 
  };

  // Helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'outofstock': return 'bg-red-100 text-red-700 border-red-200';
      case 'inactive': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {/* Header Search Filter */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Loading / Error / Table States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
            <p>Loading inventory...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>{error}</p>
            <button onClick={fetchProducts} className="mt-4 text-sm text-blue-600 hover:underline">Try Again</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Package className="w-10 h-10 mb-2 opacity-20" />
            <p>No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Name & Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400 m-auto mt-2" />
                          )}
                        </div>
                        <div>
                          <span className="block font-medium text-slate-900">{product.productName}</span>
                          <span className="block text-xs text-slate-500">{product.category}</span>
                        </div>
                      </div>
                    </td>
                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">${product.price}</span>
                        {product.offerPrice && product.offerPrice < product.price && (
                          <span className="text-xs text-emerald-600 font-medium">Offer: ${product.offerPrice}</span>
                        )}
                      </div>
                    </td>
                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${product.stock < 10 && product.stock > 0 ? 'text-amber-600' : product.stock === 0 ? 'text-red-600' : 'text-slate-600'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)} capitalize`}>
                        {product.status}
                      </span>
                    </td>
                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {/* Edit Button */}
                        {canEdit && (
                          <button
                            onClick={() => handleEditClick(product)} 
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button */}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal (Existing) */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Edit Modal (New) */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        product={productToEdit}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default ProductTable;