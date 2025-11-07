import React, { useMemo } from 'react';
import './PhoneInput.css';

// PhoneInput shows a fixed +63 prefix visually for PH numbers and keeps
// the stored value in the form as a local 11-digit number (starting with 0)
// so existing validation (11 digits) keeps working.
const PhoneInput = ({ value, onChange, placeholder, className, ...props }) => {
  // Normalize incoming value to digits only
  const digits = String(value || '').replace(/\D/g, '');

  // Determine the national (local) part to show in the input (without leading 0)
  const nationalPart = useMemo(() => {
    if (!digits) return '';
    // If value was stored as 09xxxxxxxxx (11 digits starting with 0)
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    // If value looks like it has country code 63 + 9xxxxxxxxx (12 digits)
    if (digits.length >= 12 && digits.startsWith('63')) return digits.slice(digits.startsWith('63') ? 2 : 0).slice(0, 10);
    // If user stored only the national 10-digit part (starting with 9)
    if (digits.length === 10) return digits;
    // Fallback: if shorter, return as-is
    return digits.slice(0, 10);
  }, [digits]);

  const handleInnerChange = (e) => {
    let v = String(e.target.value || '').replace(/\D/g, '').slice(0, 10);
    // Convert to stored local format: leading 0 + nationalPart (total 11 digits)
    const stored = v ? ('0' + v) : '';
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
        maxLength={11}
        {...props}
      />
    </div>
  );
};

export default PhoneInput;
