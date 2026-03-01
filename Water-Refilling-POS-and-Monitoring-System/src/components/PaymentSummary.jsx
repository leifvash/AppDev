import React from 'react';
import '../styles/components/PaymentSummary.css';
import Button from './Button';
import { CreditCard } from 'lucide-react';

const PaymentSummary = ({ items, onPayNow, isDisabled }) => {
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    return {
      itemCount: items.length,
      subtotal: subtotal
    };
  };

  const totals = calculateTotals();

  return (
    <div className="payment-summary-container">
      <h3 className="payment-summary__title">Payment Summary</h3>

      <div className="payment-summary__details">
        <div className="summary-row">
          <span className="summary-label">Total Items:</span>
          <span className="summary-value">{totals.itemCount}</span>
        </div>

        <div className="summary-row summary-row--separator"></div>

        <div className="summary-row summary-row--total">
          <span className="summary-label">Total Amount:</span>
          <span className="summary-value">₱{totals.subtotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={onPayNow}
        variant="primary"
        size="large"
        icon={<CreditCard size={20} />}
        disabled={isDisabled}
        className="payment-btn"
      >
        Pay Now
      </Button>
    </div>
  );
};

export default PaymentSummary;
