import React, { useEffect } from 'react';
import '../styles/components/OrderReceipt.css';
import Button from './Button';

const OrderReceipt = ({ orderData, onClose }) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="receipt-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h2 className="receipt-header__title">Order Confirmed</h2>
          <button className="receipt-close" onClick={onClose}>✕</button>
        </div>

        <div className="receipt-content">
          <div className="receipt-section">
            <h3 className="receipt-section__title">Customer Information</h3>
            <div className="receipt-row">
              <span className="receipt-label">Name:</span>
              <span className="receipt-value">{orderData.customerName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Type:</span>
              <span className="receipt-value">{orderData.orderType === 'delivery' ? 'Delivery' : 'Walk In'}</span>
            </div>
            {orderData.deliveryAddress && (
              <>
                <div className="receipt-row">
                  <span className="receipt-label">Address:</span>
                  <span className="receipt-value">{orderData.deliveryAddress}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Contact:</span>
                  <span className="receipt-value">{orderData.contactNumber}</span>
                </div>
              </>
            )}
          </div>

          <div className="receipt-section">
            <h3 className="receipt-section__title">Order Details</h3>
            <div className="receipt-row">
              <span className="receipt-label">Product:</span>
              <span className="receipt-value">{orderData.product.size}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Quantity:</span>
              <span className="receipt-value">{orderData.quantity} unit(s)</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Price per Unit:</span>
              <span className="receipt-value">₱{orderData.pricePerUnit.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h3 className="receipt-section__title">Payment Summary</h3>
            <div className="receipt-row receipt-row--total">
              <span className="receipt-label">Total Amount:</span>
              <span className="receipt-value">₱{orderData.totalAmount.toFixed(2)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Payment Method:</span>
              <span className="receipt-value">{orderData.paymentMethod.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount Paid:</span>
              <span className="receipt-value">₱{orderData.amountPaid.toFixed(2)}</span>
            </div>
            <div className="receipt-row receipt-row--change">
              <span className="receipt-label">Change:</span>
              <span className="receipt-value">₱{orderData.change.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-footer">
            <p className="receipt-footer__text">Order #: {orderData.id}</p>
            <p className="receipt-footer__text">Date: {orderData.date} {orderData.time}</p>
            <p className="receipt-footer__text">Thank you for your order!</p>
          </div>
        </div>

        <div className="receipt-actions">
          <Button
            variant="primary"
            size="medium"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
