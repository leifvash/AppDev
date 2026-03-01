import React, { useState } from 'react';
import '../styles/components/AddItemForm.css';
import InputField from './InputField';
import Button from './Button';
import { Plus, Trash2 } from 'lucide-react';

const AddItemForm = ({ onAddItem }) => {
  const [formData, setFormData] = useState({
    productType: '5L',
    quantity: 1,
    customProductSize: '',
    customUnit: 'L',
    pricePerUnit: ''
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

    if (formData.productType === 'custom') {
      if (!formData.customProductSize.trim()) {
        newErrors.customProductSize = 'Please specify product size';
      } else if (isNaN(formData.customProductSize) || parseFloat(formData.customProductSize) <= 0) {
        newErrors.customProductSize = 'Product size must be a positive number';
      }
    }

    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.pricePerUnit || isNaN(formData.pricePerUnit) || parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Price must be greater than 0';
    }

    return newErrors;
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
      const item = {
        id: Date.now(),
        product: {
          type: formData.productType,
          size: getProductDescription()
        },
        quantity: parseInt(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        totalPrice: parseInt(formData.quantity) * parseFloat(formData.pricePerUnit)
      };

      onAddItem(item);

      // Clear form
      setFormData({
        productType: '5L',
        quantity: 1,
        customProductSize: '',
        customUnit: 'L',
        pricePerUnit: ''
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="add-item-form-container">
      <h3 className="add-item-form__title">Add Item to Order</h3>

      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-row-compact">
          <div className="form-field-compact">
            <label className="form-label-compact">Product</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              className="form-select-compact"
            >
              <option value="5L">5 Liters</option>
              <option value="10L">10 Liters</option>
              <option value="20L">20 Liters</option>
              <option value="custom">Custom Size</option>
            </select>
          </div>

          {formData.productType === 'custom' && (
            <>
              <div className="form-field-compact">
                <InputField
                  label="Size"
                  type="number"
                  placeholder="Size"
                  name="customProductSize"
                  value={formData.customProductSize}
                  onChange={handleInputChange}
                  error={errors.customProductSize}
                />
              </div>
              <div className="form-field-compact">
                <label className="form-label-compact">Unit</label>
                <select
                  name="customUnit"
                  value={formData.customUnit}
                  onChange={handleInputChange}
                  className="form-select-compact"
                >
                  <option value="L">Liters (L)</option>
                  <option value="mL">Milliliters (mL)</option>
                </select>
              </div>
            </>
          )}

          <div className="form-field-compact">
            <InputField
              label="Qty"
              type="number"
              placeholder="Qty"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              error={errors.quantity}
            />
          </div>

          <div className="form-field-compact">
            <InputField
              label="Price (₱)"
              type="number"
              placeholder="Price"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={handleInputChange}
              error={errors.pricePerUnit}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          icon={<Plus size={18} />}
        >
          Add Item
        </Button>
      </form>
    </div>
  );
};

export default AddItemForm;
