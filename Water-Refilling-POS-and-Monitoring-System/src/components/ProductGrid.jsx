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
    ],
  };

  const currentProducts = products[activeTab];

  const tabs = [
    { id: 'refills', label: 'Refills' },
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
