import React from 'react';
import '../styles/components/OrderSummary.css';
import { Trash2, TrendingUp } from 'lucide-react';

const OrderSummary = ({ items, onUpdateQuantity, onRemoveItem, }) => {

  if (items.length === 0) {
    return (
      <div className="order-summary-container">
        <h3 className="order-summary__title">Current Order</h3>
        <div className="order-summary__empty">
          <TrendingUp size={40} className="order-summary__empty-icon" />
          <p>No items added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-summary-container">
      <h3 className="order-summary__title">Current Order</h3>

      <div className="order-items">
        {items.map((item) => (
          <div key={item.id} className="order-item">
            <div className="order-item__content">
              <p className="order-item__name">{item.name}</p>
              <div className="order-item__controls">
                <button
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  title="Decrease quantity"
                >
                  −
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  title="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <div className="order-item__actions">
              <span className="order-item__price">₱{item.subtotal.toFixed(2)}</span>
              <button
                className="order-item__delete"
                onClick={() => onRemoveItem(item.id)}
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
