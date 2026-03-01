import React, { useState } from 'react';
import '../styles/components/CashierForm.css';
import InputField from './InputField';
import Button from './Button';

const CashierForm = ({ onOrderSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    orderType: 'walk-in',
    deliveryAddress: '',
    contactNumber: '',
    productType: '5L',
    quantity: 1,
    customProductSize: '',
    customUnit: 'L',
    pricePerUnit: '',
    paymentMethod: 'cash',
    amountPaid: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer name validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Customer name must be at least 2 characters';
    }

    // Order type is always valid (radio button)

    // Delivery-specific validation
    if (formData.orderType === 'delivery') {
      if (!formData.deliveryAddress.trim()) {
        newErrors.deliveryAddress = 'Delivery address is required';
      } else if (formData.deliveryAddress.trim().length < 5) {
        newErrors.deliveryAddress = 'Address must be at least 5 characters';
      }

      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.contactNumber)) {
        newErrors.contactNumber = 'Please enter a valid contact number';
      }
    }

    // Product validation
    if (formData.productType === 'custom') {
      if (!formData.customProductSize.trim()) {
        newErrors.customProductSize = 'Please specify product size';
      } else if (isNaN(formData.customProductSize) || parseFloat(formData.customProductSize) <= 0) {
        newErrors.customProductSize = 'Product size must be a positive number';
      }
    }

    // Quantity validation
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    // Price validation
    if (!formData.pricePerUnit || isNaN(formData.pricePerUnit) || parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Price must be greater than 0';
    }

    // Amount paid validation
    const totalAmount = calculateTotal();
    if (!formData.amountPaid || isNaN(formData.amountPaid) || parseFloat(formData.amountPaid) < totalAmount) {
      newErrors.amountPaid = `Amount paid must be at least ₱${totalAmount.toFixed(2)}`;
    }

    return newErrors;
  };

  const calculateTotal = () => {
    const price = parseFloat(formData.pricePerUnit) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    return price * quantity;
  };

  const calculateChange = () => {
    const total = calculateTotal();
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    return Math.max(0, amountPaid - total);
  };

  const getProductDescription = () => {
    if (formData.productType === 'custom') {
      return `${formData.customProductSize}${formData.customUnit}`;
    }
    return formData.productType;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      // Create order object
      const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        customerName: formData.customerName,
        orderType: formData.orderType,
        deliveryAddress: formData.orderType === 'delivery' ? formData.deliveryAddress : null,
        contactNumber: formData.orderType === 'delivery' ? formData.contactNumber : null,
        product: {
          type: formData.productType,
          size: getProductDescription()
        },
        quantity: parseInt(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        amountPaid: parseFloat(formData.amountPaid),
        change: calculateChange()
      };

      // Submit order
      onOrderSubmit(order);

      // Clear form
      setFormData({
        customerName: '',
        orderType: 'walk-in',
        deliveryAddress: '',
        contactNumber: '',
        productType: '5L',
        quantity: 1,
        customProductSize: '',
        customUnit: 'L',
        pricePerUnit: '',
        paymentMethod: 'cash',
        amountPaid: ''
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleClear = () => {
    setFormData({
      customerName: '',
      orderType: 'walk-in',
      deliveryAddress: '',
      contactNumber: '',
      productType: '5L',
      quantity: 1,
      customProductSize: '',
      customUnit: 'L',
      pricePerUnit: '',
      paymentMethod: 'cash',
      amountPaid: ''
    });
    setErrors({});
  };

  return (
    <div className="cashier-form-container">
      <h2 className="cashier-form__title">Order Form</h2>

      <form onSubmit={handleSubmit} className="cashier-form">
        {/* Customer Information Section */}
        <section className="form-section">
          <h3 className="form-section__title">Customer Information</h3>
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

        {/* Order Type Section */}
        <section className="form-section">
          <h3 className="form-section__title">Order Type</h3>
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

        {/* Delivery Details Section */}
        {formData.orderType === 'delivery' && (
          <section className="form-section form-section--delivery">
            <h3 className="form-section__title">Delivery Details</h3>
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

        {/* Product Selection Section */}
        <section className="form-section">
          <h3 className="form-section__title">Product Selection</h3>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Product Type</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="5L">5 Liters</option>
                <option value="10L">10 Liters</option>
                <option value="20L">20 Liters</option>
                <option value="custom">Custom Size</option>
              </select>
            </div>

            {formData.productType === 'custom' && (
              <div className="form-field-group">
                <div className="form-field">
                  <InputField
                    label="Size"
                    type="number"
                    placeholder="Enter size"
                    name="customProductSize"
                    value={formData.customProductSize}
                    onChange={handleInputChange}
                    error={errors.customProductSize}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Unit</label>
                  <select
                    name="customUnit"
                    value={formData.customUnit}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="L">Liters (L)</option>
                    <option value="mL">Milliliters (mL)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <InputField
            label="Quantity"
            type="number"
            placeholder="Enter quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            error={errors.quantity}
            required
          />
        </section>

        {/* Payment Section */}
        <section className="form-section">
          <h3 className="form-section__title">Payment Information</h3>

          <div className="payment-summary">
            <div className="summary-row">
              <span className="summary-label">Product:</span>
              <span className="summary-value">{getProductDescription()}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Quantity:</span>
              <span className="summary-value">{formData.quantity}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Price per Unit:</span>
              <span className="summary-value">₱{parseFloat(formData.pricePerUnit || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row summary-row--total">
              <span className="summary-label">Total:</span>
              <span className="summary-value">₱{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <InputField
            label="Price per Unit (₱)"
            type="number"
            placeholder="Enter price"
            name="pricePerUnit"
            value={formData.pricePerUnit}
            onChange={handleInputChange}
            error={errors.pricePerUnit}
            required
          />

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

        {/* Form Actions */}
        <section className="form-section form-section--actions">
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
            onClick={handleClear}
          >
            Clear Form
          </Button>
        </section>
      </form>
    </div>
  );
};

export default CashierForm;
