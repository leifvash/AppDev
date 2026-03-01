import React, { useEffect } from 'react';
import '../styles/components/OrderSuccessModal.css';
import { CheckCircle } from 'lucide-react';
import Button from './Button';

const OrderSuccessModal = ({ order, onClose }) => {
  useEffect(() => {
    // Auto-redirect to cashier after 4 seconds
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-overlay">
      <div className="success-modal">
        <div className="success-content">
          <div className="success-icon">
            <CheckCircle size={80} />
          </div>

          <h2 className="success-title">Order Successful!</h2>

          <div className="success-details">
            <p className="success-message">Your order has been completed successfully.</p>

            <div className="order-info">
              <div className="order-info-item">
                <span className="order-info-label">Order Number:</span>
                <span className="order-info-value">#{order.id}</span>
              </div>
              <div className="order-info-item">
                <span className="order-info-label">Customer:</span>
                <span className="order-info-value">{order.customerName}</span>
              </div>
              <div className="order-info-item">
                <span className="order-info-label">Total Amount:</span>
                <span className="order-info-value amount">₱{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="auto-redirect-text">Redirecting to cashier in 4 seconds...</p>
          </div>

          <div className="success-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={onClose}
            >
              Back to Cashier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
