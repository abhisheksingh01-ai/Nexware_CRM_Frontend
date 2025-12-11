import { useState } from 'react';
import ProductHeader from './productPage/ProductHeader'; 
import AddProductModal from './productPage/AddProductModal';
import ProductStats from './productPage/ProductStats';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleProductCreated = (newProduct) => {
    console.log("New Product Created:", newProduct);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProductHeader onAddClick={handleOpenModal} />
        <ProductStats/>
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          onSubmit={handleProductCreated}
        />
        
      </div>
    </div>
  );
}