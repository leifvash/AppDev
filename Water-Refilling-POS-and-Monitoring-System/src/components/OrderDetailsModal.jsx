import React from 'react';
import '../styles/components/OrderDetailsModal.css';
import Button from './Button';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const getOrderTypeLabel = (type) => {
    return type === 'walk-in' ? 'Walk In' : 'Delivery';
  };

  return (
    <div className="order-details-overlay">
      <div className="order-details-modal">
        <div className="order-details-header">
          <h2 className="order-details-header__title">Order Details</h2>
          <button className="order-details-close" onClick={onClose}>✕</button>
        </div>

        <div className="order-details-content">
          {/* Order Header */}
          <section className="details-section">
            <h3 className="details-section__title">Order Information</h3>
            <div className="details-grid">
              <div className="details-item">
                <span className="details-label">Order ID:</span>
                <span className="details-value">#{order.id}</span>
              </div>
              <div className="details-item">
                <span className="details-label">Date:</span>
                <span className="details-value">{order.date}</span>
              </div>
              <div className="details-item">
                <span className="details-label">Time:</span>
                <span className="details-value">{order.time}</span>
              </div>
              <div className="details-item">
                <span className="details-label">Order Type:</span>
                <span className="details-value">{getOrderTypeLabel(order.orderType)}</span>
              </div>
            </div>
          </section>

          {/* Customer Information */}
          <section className="details-section">
            <h3 className="details-section__title">Customer Information</h3>
            <div className="details-grid">
              <div className="details-item">
                <span className="details-label">Name:</span>
                <span className="details-value">{order.customerName}</span>
              </div>
              {order.orderType === 'delivery' && order.deliveryAddress && (
                <>
                  <div className="details-item">
                    <span className="details-label">Address:</span>
                    <span className="details-value">{order.deliveryAddress}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Contact:</span>
                    <span className="details-value">{order.contactNumber}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Order Items */}
          <section className="details-section">
            <h3 className="details-section__title">Products</h3>
            <div className="details-table">
              <div className="details-table-header">
                <span>Product</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              {order.items && order.items.map(item => (
                <div key={item.id} className="details-table-row">
                  <span>{item.name}</span>
                  <span className="qty-cell">{item.quantity}</span>
                  <span className="price-cell">₱{item.price.toFixed(2)}</span>
                  <span className="total-cell">₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Summary */}
          <section className="details-section">
            <h3 className="details-section__title">Payment Summary</h3>
            <div className="details-grid">
              <div className="details-item">
                <span className="details-label">Total Amount:</span>
                <span className="details-value details-value--amount">₱{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="details-item">
                <span className="details-label">Payment Method:</span>
                <span className="details-value">{order.paymentMethod === 'cash' ? 'Cash' : order.paymentMethod}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="order-details-actions">
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
