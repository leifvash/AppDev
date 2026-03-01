import React, { useState } from 'react';
import '../styles/components/InputField.css';

const InputField = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = null,
  required = false,
  name
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="input-field">
      {label && (
        <label className="input-field__label">
          {label}
          {required && <span className="input-field__required">*</span>}
        </label>
      )}
      <input
        className={`input-field__input ${error ? 'input-field__input--error' : ''} ${isFocused ? 'input-field__input--focused' : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        name={name}
        required={required}
      />
      {error && <span className="input-field__error">{error}</span>}
    </div>
  );
};

export default InputField;
