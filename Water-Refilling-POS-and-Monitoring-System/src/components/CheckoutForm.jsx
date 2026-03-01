import React, { useState } from 'react';
import '../styles/components/CheckoutForm.css';
import InputField from './InputField';
import Button from './Button';

const CheckoutForm = ({ cartItems, totalAmount, onCheckout, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    orderType: 'walk-in',
    deliveryAddress: '',
    contactNumber: ''
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
      } else if (formData.contactNumber.trim().length < 10) {
        newErrors.contactNumber = 'Contact number must be valid';
      }
    }

    return newErrors;
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
        paymentMethod: 'cash'
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
          <h2 className="checkout-header__title">Complete Purchase</h2>
          <button className="checkout-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
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
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <span>Total Amount:</span>
                  <span>₱{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Payment Information */}
            <section className="checkout-section">
              <h3 className="checkout-section__title">Payment Method</h3>
              <div className="payment-method-info">
                <p className="payment-method-text">
                  <strong>Cash</strong> - Please prepare the exact amount or have cash ready for change.
                </p>
              </div>
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
