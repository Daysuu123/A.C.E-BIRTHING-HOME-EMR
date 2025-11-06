import React, { useMemo } from 'react';
import './PhoneInput.css';

// PhoneInput shows a fixed +63 prefix visually for PH numbers and keeps
// the stored value in the form as a local 11-digit number (starting with 0)
// so existing validation (11 digits) keeps working.
const PhoneInput = ({ value, onChange, placeholder, className, ...props }) => {
  // Normalize incoming value to digits only
  const digits = String(value || '').replace(/\D/g, '');

  // Determine the national (local) part to show in the input
  const nationalPart = useMemo(() => {
    if (!digits) return '';
    if (digits.startsWith('63')) return digits.slice(2);
    return digits;
  }, [digits]);

  const handleInnerChange = (e) => {
    let v = String(e.target.value || '').replace(/\D/g, '').slice(0, 9);
    const stored = v ? ('63' + v) : '';
    if (onChange) onChange(stored);
  };

  return (
    <div className={`phone-input ${className || ''}`}>
      <span className="phone-prefix">+63</span>
      <input
        type="tel"
        value={nationalPart}
        onChange={handleInnerChange}
        placeholder={placeholder || "9XXXXXXXXX"}
        className="phone-field"
        maxLength={9}
        {...props}
      />
    </div>
  );
};

export default PhoneInput;
