import React, { useState } from 'react';
import '../styles/components/ProductGrid.css';
import { Package, Zap, Plus, AlertCircle } from 'lucide-react';

const ProductGrid = ({ onAddProduct, inventory = {}, cartItems = [] }) => {
  const [activeTab, setActiveTab] = useState('refills');

  const products = {
    refills: [
      { id: 1, name: 'Used 5 Liter\nPurified Water', icon: Package, price: 5 },
      { id: 2, name: 'New 5 Liter\nPurified Water', icon: Package, price: 140 },
      { id: 3, name: 'Used 10 Liter\nPurified Water', icon: Package, price: 80 },
      { id: 4, name: 'New 10 Liter\nPurified Water', icon: Package, price: 160 },
      { id: 5, name: 'Used 20 Liter\nEmpty Container', icon: Package, price: 20 },
      { id: 6, name: 'New 20 Liter\nEmpty Container', icon: Package, price: 180 },
    ],
  };

  const currentProducts = products[activeTab];

  const tabs = [
    { id: 'refills', label: 'Refills' },
  ];

  // Calculate available stock considering what's already in cart
  const getAvailableStock = (productId) => {
    const totalInventory = inventory[productId] || 0;
    const inCart = cartItems
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(0, totalInventory - inCart);
  };

  const isOutOfStock = (productId) => {
    return getAvailableStock(productId) <= 0;
  };

  const getStockQuantity = (productId) => {
    return getAvailableStock(productId);
  };

  const handleAddProduct = (product) => {
    if (isOutOfStock(product.id)) {
      return; // Don't add if out of stock
    }
    onAddProduct(product);
  };

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
          const outOfStock = isOutOfStock(product.id);
          const stockQty = getStockQuantity(product.id);
          
          return (
            <div key={product.id} className={`product-card ${outOfStock ? 'product-card--out-of-stock' : ''}`}>
              <div className="product-card__icon-container">
                <IconComponent size={48} className="product-card__icon" />
              </div>
              <button
                className={`product-card__add-btn ${outOfStock ? 'product-card__add-btn--disabled' : ''}`}
                onClick={() => handleAddProduct(product)}
                title={outOfStock ? 'Out of stock' : 'Add to cart'}
                disabled={outOfStock}
              >
                {outOfStock ? <AlertCircle size={20} /> : <Plus size={20} />}
              </button>
              <p className="product-card__label">{product.name}</p>
              <div className={`product-card__stock ${outOfStock ? 'product-card__stock--low' : stockQty <= 5 ? 'product-card__stock--warning' : 'product-card__stock--ok'}`}>
                Stock: {stockQty}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;

