import React, { useState } from 'react';
import '../styles/components/ProductGrid.css';
import { Package, Zap, Plus } from 'lucide-react';

const ProductGrid = ({ onAddProduct }) => {
  const [activeTab, setActiveTab] = useState('refills');

  const products = {
    refills: [
      { id: 1, name: 'Used 5 Liter\nPurified Water', icon: Package, price: 50 },
      { id: 2, name: 'New 5 Liter\nPurified Water', icon: Package, price: 60 },
      { id: 3, name: 'Used 10 Liter\nPurified Water', icon: Package, price: 80 },
      { id: 4, name: 'New 10 Liter\nPurified Water', icon: Package, price: 100 },
      { id: 5, name: 'Used 20 Liter\nEmpty Container', icon: Package, price: 100 },
      { id: 6, name: 'New 20 Liter\nEmpty Container', icon: Package, price: 150 },
      { id: 7, name: 'Premium Refill\n5 Liter', icon: Package, price: 70 },
      { id: 8, name: 'Premium Refill\n10 Liter', icon: Package, price: 120 },
      { id: 9, name: 'Premium Refill\n20 Liter', icon: Package, price: 180 },
    ],
    bottles: [
      { id: 10, name: 'Plastic Bottle\n5 Liter', icon: Package, price: 35 },
      { id: 11, name: 'Plastic Bottle\n10 Liter', icon: Package, price: 45 },
      { id: 12, name: 'Glass Bottle\n5 Liter', icon: Package, price: 55 },
      { id: 13, name: 'Glass Bottle\n10 Liter', icon: Package, price: 75 },
      { id: 14, name: 'Ceramic Dispenser\nBottle', icon: Package, price: 200 },
      { id: 15, name: 'Travel Bottle\n2 Liter', icon: Package, price: 25 },
      { id: 16, name: 'Premium Bottle\n5 Liter', icon: Package, price: 90 },
      { id: 17, name: 'Premium Bottle\n10 Liter', icon: Package, price: 150 },
      { id: 18, name: 'Bulk Container\n20 Liter', icon: Package, price: 250 },
    ],
    accessories: [
      { id: 19, name: 'Water Dispenser\nStand', icon: Zap, price: 500 },
      { id: 20, name: 'Replacement Filter\nPack', icon: Zap, price: 80 },
      { id: 21, name: 'Universal Cap\nSet', icon: Zap, price: 40 },
      { id: 22, name: 'Bottle Carrier\nBag', icon: Zap, price: 120 },
      { id: 23, name: 'Water Cooler\nUnit', icon: Zap, price: 3000 },
      { id: 24, name: 'Cleaning Kit\nComplete', icon: Zap, price: 150 },
      { id: 25, name: 'Pump Station\nBasic', icon: Zap, price: 800 },
      { id: 26, name: 'UV Sterilizer\nModule', icon: Zap, price: 1200 },
      { id: 27, name: 'Smart Dispenser\nPad', icon: Zap, price: 2000 },
    ],
  };

  const currentProducts = products[activeTab];

  const tabs = [
    { id: 'refills', label: 'Refills' },
    { id: 'bottles', label: 'Bottles' },
    { id: 'accessories', label: 'Accessories' },
  ];

  return (
    <div className="product-grid-container">
      <div className="product-header">
        <h2 className="product-title">Product Grid</h2>
      </div>

      <div className="product-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`product-tab ${activeTab === tab.id ? 'product-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {currentProducts.map(product => {
          const IconComponent = product.icon;
          return (
            <div key={product.id} className="product-card">
              <div className="product-card__icon-container">
                <IconComponent size={48} className="product-card__icon" />
              </div>
              <button
                className="product-card__add-btn"
                onClick={() => onAddProduct(product)}
                title="Add to cart"
              >
                <Plus size={20} />
              </button>
              <p className="product-card__label">{product.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
