import '../styles/components/PaymentSummaryNew.css';
import Button from './Button';
import { CreditCard } from 'lucide-react';

const PaymentSummaryNew = ({ items, onPayNow, isDisabled }) => {

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = Math.max(0, subtotal);

  return (
    <div className="payment-summary-new-container">
      <div className="payment-header">
        <div className="payment-header__item">
          <span className="payment-header__label">Subtotal</span>
          <span className="payment-header__value">₱{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-total">
        <span className="payment-total__label">Total:</span>
        <span className="payment-total__amount">₱{total.toFixed(2)}</span>
      </div>

      <Button
        onClick={() => onPayNow({ subtotal, total })}
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
