import React, { useState } from 'react';
import '../styles/components/PaymentSummaryNew.css';
import Button from './Button';
import { CreditCard } from 'lucide-react';

const PaymentSummaryNew = ({ items, onPayNow, isDisabled }) => {
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="payment-summary-new-container">
      <div className="payment-header">
        <div className="payment-header__item">
          <span className="payment-header__label">Subtotal</span>
          <span className="payment-header__value">₱{subtotal.toFixed(2)}</span>
        </div>
        <div className="payment-header__divider"></div>
        <div className="payment-header__item">
          <span className="payment-header__label">Discount</span>
          <div className="discount-input-group">
            <input
              type="number"
              className="discount-input"
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0.00"
              min="0"
            />
            <span className="discount-currency">₱</span>
          </div>
        </div>
      </div>

      <div className="payment-total">
        <span className="payment-total__label">Total:</span>
        <span className="payment-total__amount">₱{total.toFixed(2)}</span>
      </div>

      <Button
        onClick={() => onPayNow({ subtotal, discount, total })}
        variant="primary"
        size="large"
        icon={<CreditCard size={20} />}
        disabled={isDisabled}
        className="payment-btn-full"
      >
        Pay Now
      </Button>
    </div>
  );
};

export default PaymentSummaryNew;
