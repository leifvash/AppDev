import React from 'react';
import '../styles/components/InventoryView.css';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

const InventoryView = ({ inventory = {} }) => {
  const products = [
    { id: 1, name: 'Used 5 Liter Purified Water', price: 5 },
    { id: 2, name: 'New 5 Liter Purified Water', price: 140 },
    { id: 3, name: 'Used 10 Liter Purified Water', price: 10 },
    { id: 4, name: 'New 10 Liter Purified Water', price: 160 },
    { id: 5, name: 'Used 20 Liter Empty Container', price: 20 },
    { id: 6, name: 'New 20 Liter Empty Container', price: 180 },
  ];

  const getStockQuantity = (productId) => {
    return inventory[productId] !== undefined ? inventory[productId] : 0;
  };

  const getStockStatus = (productId) => {
    const qty = getStockQuantity(productId);
    if (qty <= 0) return 'out-of-stock';
    if (qty <= 5) return 'low-stock';
    return 'in-stock';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'out-of-stock':
        return 'Out of Stock';
      case 'low-stock':
        return 'Low Stock';
      default:
        return 'In Stock';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'out-of-stock':
        return <AlertTriangle size={16} />;
      case 'low-stock':
        return <AlertTriangle size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  const totalStock = products.reduce((sum, p) => sum + getStockQuantity(p.id), 0);
  const lowStockCount = products.filter(p => getStockStatus(p.id) === 'low-stock').length;
  const outOfStockCount = products.filter(p => getStockStatus(p.id) === 'out-of-stock').length;

  return (
    <div className="inventory-view-container">
      <h2 className="inventory-view__title">Inventory Management</h2>

      <div className="inventory-summary">
        <div className="inventory-summary__card">
          <span className="inventory-summary__label">Total Products</span>
          <span className="inventory-summary__value">{products.length}</span>
        </div>
        <div className="inventory-summary__card">
          <span className="inventory-summary__label">Total Stock</span>
          <span className="inventory-summary__value">{totalStock}</span>
        </div>
        <div className="inventory-summary__card inventory-summary__card--warning">
          <span className="inventory-summary__label">Low Stock</span>
          <span className="inventory-summary__value">{lowStockCount}</span>
        </div>
        <div className="inventory-summary__card inventory-summary__card--danger">
          <span className="inventory-summary__label">Out of Stock</span>
          <span className="inventory-summary__value">{outOfStockCount}</span>
        </div>
      </div>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const status = getStockStatus(product.id);
              const qty = getStockQuantity(product.id);
              
              return (
                <tr key={product.id} className={`inventory-row inventory-row--${status}`}>
                  <td className="inventory-cell">{product.id}</td>
                  <td className="inventory-cell inventory-cell--name">
                    <Package size={16} />
                    {product.name}
                  </td>
                  <td className="inventory-cell">₱{product.price.toFixed(2)}</td>
                  <td className="inventory-cell inventory-cell--qty">{qty}</td>
                  <td className="inventory-cell">
                    <span className={`inventory-status inventory-status--${status}`}>
                      {getStatusIcon(status)}
                      {getStatusLabel(status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;

