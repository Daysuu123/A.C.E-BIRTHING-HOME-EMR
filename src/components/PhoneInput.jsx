import React from 'react';
import './PhoneInput.css';

// PhoneInput shows a fixed +63 prefix visually for PH numbers and keeps
// the stored value in the form as a local 11-digit number (starting with 0)
// so existing validation (11 digits) keeps working.
const PhoneInput = ({ value, onChange, placeholder, className, containerStyle, inputStyle, prefixStyle, ...props }) => {
  // Basic national part: digits only, max 10
  const nationalPart = String(value || '').replace(/\D/g, '').slice(0, 10);

  const handleInnerChange = (e) => {
    const v = String(e.target.value || '').replace(/\D/g, '').slice(0, 10);
    if (onChange) onChange(v);
  };

  return (
    <div className={`phone-input ${className || ''}`} style={containerStyle}>
      <span className="phone-prefix" style={prefixStyle}>+63</span>
      <input
        type="tel"
        value={nationalPart}
        onChange={handleInnerChange}
        placeholder={placeholder || ""}
        className="phone-field"
        style={inputStyle}
        maxLength={10}
        {...props}
      />
    </div>
  );
};

export default PhoneInput;
