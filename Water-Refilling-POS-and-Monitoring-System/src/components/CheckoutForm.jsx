import React, { useState } from 'react';
import '../styles/components/CheckoutForm.css';
import InputField from './InputField';
import Button from './Button';

const CheckoutForm = ({ cartItems, totalAmount, onCheckout, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    orderType: 'walk-in',
    deliveryAddress: '',
    contactNumber: '',
    paymentMethod: 'cash',
    amountPaid: totalAmount.toString()
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Customer name must be at least 2 characters';
    }

    if (formData.orderType === 'delivery') {
      if (!formData.deliveryAddress.trim()) {
        newErrors.deliveryAddress = 'Delivery address is required';
      } else if (formData.deliveryAddress.trim().length < 5) {
        newErrors.deliveryAddress = 'Address must be at least 5 characters';
      }

      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      }
    }

    if (!formData.amountPaid || isNaN(formData.amountPaid) || parseFloat(formData.amountPaid) < totalAmount) {
      newErrors.amountPaid = `Amount paid must be at least ₱${totalAmount.toFixed(2)}`;
    }

    return newErrors;
  };

  const calculateChange = () => {
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    return Math.max(0, amountPaid - totalAmount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      // Create order with cart items
      const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        customerName: formData.customerName,
        orderType: formData.orderType,
        deliveryAddress: formData.orderType === 'delivery' ? formData.deliveryAddress : null,
        contactNumber: formData.orderType === 'delivery' ? formData.contactNumber : null,
        items: cartItems,
        totalAmount: totalAmount,
        paymentMethod: formData.paymentMethod,
        amountPaid: parseFloat(formData.amountPaid),
        change: calculateChange()
      };

      onCheckout(order);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2 className="checkout-header__title">Complete Checkout</h2>
          <button className="checkout-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            {/* Order Summary */}
            <section className="checkout-section">
              <h3 className="checkout-section__title">Order Summary</h3>
              <div className="order-items-summary">
                <div className="summary-header">
                  <span>Product</span>
                  <span>Qty</span>
                  <span>Total</span>
                </div>
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.product.size}</span>
                    <span>{item.quantity}</span>
                    <span>₱{item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <span>Total Amount:</span>
                  <span>₱{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Customer Information */}
            <section className="checkout-section">
              <h3 className="checkout-section__title">Customer Information</h3>
              <InputField
                label="Customer Name"
                type="text"
                placeholder="Enter customer name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                error={errors.customerName}
                required
              />
            </section>

            {/* Order Type */}
            <section className="checkout-section">
              <h3 className="checkout-section__title">Order Type</h3>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="orderType"
                    value="walk-in"
                    checked={formData.orderType === 'walk-in'}
                    onChange={handleInputChange}
                  />
                  <span>Walk In</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={formData.orderType === 'delivery'}
                    onChange={handleInputChange}
                  />
                  <span>Delivery</span>
                </label>
              </div>
            </section>

            {/* Delivery Details */}
            {formData.orderType === 'delivery' && (
              <section className="checkout-section checkout-section--delivery">
                <h3 className="checkout-section__title">Delivery Details</h3>
                <InputField
                  label="Delivery Address"
                  type="text"
                  placeholder="Enter delivery address"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  error={errors.deliveryAddress}
                  required
                />
                <InputField
                  label="Contact Number"
                  type="tel"
                  placeholder="Enter contact number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  error={errors.contactNumber}
                  required
                />
              </section>
            )}

            {/* Payment */}
            <section className="checkout-section">
              <h3 className="checkout-section__title">Payment Information</h3>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="check">Check</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <InputField
                label="Amount Paid (₱)"
                type="number"
                placeholder="Enter amount paid"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleInputChange}
                error={errors.amountPaid}
                required
              />

              {formData.amountPaid && !errors.amountPaid && (
                <div className="payment-change">
                  <span className="change-label">Change:</span>
                  <span className="change-value">₱{calculateChange().toFixed(2)}</span>
                </div>
              )}
            </section>
          </div>

          {/* Actions */}
          <div className="checkout-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
            >
              Complete Order
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
