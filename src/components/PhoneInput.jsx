import React, { useMemo, useState } from "react";

const COUNTRIES = [
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭', nsn: 11 },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', nsn: 11 },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬', nsn: 10 },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪', nsn: 12 },
  { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰', nsn: 11 },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵', nsn: 12 },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', nsn: 11 },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', nsn: 11 },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', nsn: 12 },
];

function sanitize(raw) {
  let v = String(raw || "");
  v = v.replace(/[^+\d]/g, "");
  v = v.replace(/\+/g, (m, i) => (i === 0 ? "+" : ""));
  if (v.startsWith("+")) return "+" + v.slice(1).replace(/\D/g, "");
  return v.replace(/\D/g, "");
}

function PhoneInput({ value, onChange, defaultCountry = '', placeholder = '+639XXXXXXXXX', inputProps = {} }) {
  const initialCountry = useMemo(() => {
    if (value && String(value).startsWith("+")) {
      const found = COUNTRIES.find(c => value.startsWith(c.dial));
      if (found) return found.code;
    }
    return defaultCountry || '';
  }, [value, defaultCountry]);

  const [country, setCountry] = useState(initialCountry);

  const countryData = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];

  const handleCountryChange = (code) => {
    if (!code) { setCountry(''); return; }
    const nextCountry = COUNTRIES.find(c => c.code === code) || countryData;
    setCountry(nextCountry.code);
    const digits = String(value || "").replace(/[^\d]/g, "");
    // strip former dial if present
    let national = digits;
    if (value && String(value).startsWith("+")) {
      const current = COUNTRIES.find(c => String(value).startsWith(c.dial));
      if (current) {
        const old = current.dial.replace('+','');
        if (national.startsWith(old)) national = national.slice(old.length);
      }
    }
    const limited = national.slice(0, Math.max(0, 11));
    const next = nextCountry.dial + limited;
    onChange(next);
  };

  const handleChange = (e) => {
    const raw = sanitize(e.target.value);
    const hasPlus = raw.startsWith("+");
    const digits = raw.replace(/\D/g, "");
    const limited = digits.slice(0, 11);
    const next = hasPlus ? (limited ? "+" + limited : "") : limited;
    onChange(next);
  };

  const handleBlur = () => {
    const raw = String(value || "");
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    onChange(digits ? "+" + digits : "");
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
      <select value={country} onChange={(e)=>handleCountryChange(e.target.value)}>
        <option value="">Select Country</option>
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.dial})</option>
        ))}
      </select>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        inputMode="tel"
        placeholder={placeholder}
        {...inputProps}
      />
    </div>
  );
}

export default PhoneInput;


