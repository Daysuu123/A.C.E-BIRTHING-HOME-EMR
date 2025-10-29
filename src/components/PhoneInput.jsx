import React from "react";

function normalizeDigits(raw) {
  return String(raw || "").replace(/\D/g, "").slice(0, 15);
}

function PhoneInput({ value, onChange, placeholder = 'Enter contact number', inputProps = {} }) {
  const handleChange = (e) => {
    const digits = normalizeDigits(e.target.value);
    onChange(digits);
  };

  return (
    <input
      type="tel"
      value={value}
      onChange={handleChange}
      inputMode="tel"
      placeholder={placeholder}
      {...inputProps}
    />
  );
}

export default PhoneInput;


