import React from 'react';
import '../styles/components/CurrentOrder.css';
import { Trash2 } from 'lucide-react';

const CurrentOrder = ({ items, onRemoveItem }) => {
  if (items.length === 0) {
    return (
      <div className="current-order-container">
        <h3 className="current-order__title">Current Order</h3>
        <div className="current-order__empty">
          <p>No items added yet. Click "Add Item" to start.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="current-order-container">
      <h3 className="current-order__title">Current Order</h3>

      <div className="current-order__table-wrapper">
        <table className="current-order__table">
          <thead>
            <tr>
              <th className="table-header">#</th>
              <th className="table-header">Product</th>
              <th className="table-header">Qty</th>
              <th className="table-header">Price</th>
              <th className="table-header">Subtotal</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="table-row">
                <td className="table-cell">{index + 1}</td>
                <td className="table-cell">{item.product.size}</td>
                <td className="table-cell">{item.quantity}</td>
                <td className="table-cell">₱{item.pricePerUnit.toFixed(2)}</td>
                <td className="table-cell table-cell--subtotal">
                  ₱{item.totalPrice.toFixed(2)}
                </td>
                <td className="table-cell table-cell--action">
                  <button
                    className="delete-item-btn"
                    onClick={() => onRemoveItem(item.id)}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentOrder;
