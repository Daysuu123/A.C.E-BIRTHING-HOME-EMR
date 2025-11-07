import React, { useState } from "react";
import PhoneInput from "../components/PhoneInput";
import "./Staffregister.css";
import AdminLayout from "../components/AdminLayout";

function Staffregister() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ lastName: "", firstName: "", middleInitial: "", email: "", phone: "", position: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showSubmitError, setShowSubmitError] = useState(false);

  const nameRegex = /^[A-Za-z ]+$/;
  const miRegex = /^[A-Za-z]$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
  const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  function validate(field, value, current = { ...form, [field]: value }) {
    const v = String(value || "").trim();
    const next = { ...errors };
    switch (field) {
      case "lastName":
      case "firstName":
        next[field] = v ? (nameRegex.test(v) ? "" : "Letters and spaces only.") : "This field is required.";
        break;
      case "middleInitial":
        next.middleInitial = v ? (miRegex.test(v) && v.length === 1 ? "" : "Single letter only.") : "This field is required.";
        break;
      case "email":
        next.email = v ? (emailRegex.test(v) ? "" : "Enter a valid .com email.") : "This field is required.";
        break;
      case "password":
        next.password = pwRegex.test(v) ? "" : "At least 8 chars, 1 uppercase, 1 number, 1 special.";
        // keep confirm match updated
        if (current.confirmPassword) next.confirmPassword = current.confirmPassword === v ? "" : "Passwords do not match.";
        break;
      case "confirmPassword":
        if (!v || !current.password) {
          next.confirmPassword = "";
        } else {
          next.confirmPassword = v === current.password ? "" : "Passwords do not match.";
        }
        break;
      default:
        break;
    }
    setErrors(next);
  }

  function onChange(e) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    validate(name, value, next);
    setShowSubmitError(false);
    // clear only when all fields complete/valid
    const fields = ["lastName","firstName","middleInitial","email","password","confirmPassword","position"];
    const allFilled = fields.every(f => String(next[f]||"").trim());
    const allValid =
      nameRegex.test(next.lastName||"") &&
      nameRegex.test(next.firstName||"") &&
      miRegex.test(next.middleInitial||"") && (String(next.middleInitial||"").length === 1) &&
      emailRegex.test(next.email||"") &&
      pwRegex.test(next.password||"") &&
      next.password === next.confirmPassword &&
      next.position !== "";
    if (allFilled && allValid) {/* nothing extra */}
  }

  return (
    <AdminLayout title="Staff Registration">
      <form className="form">
        <div className="row">
          <label className="field">
            <span>Last Name:</span>
            <input name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.lastName? 'visible':'hidden'}}>{errors.lastName || 'placeholder'}</div>
          </label>
          <label className="field">
            <span>First Name:</span>
            <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.firstName? 'visible':'hidden'}}>{errors.firstName || 'placeholder'}</div>
          </label>
          <label className="field">
            <span>Middle Initial:</span>
            <input name="middleInitial" type="text" placeholder="M.I." maxLength={1} value={form.middleInitial} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.middleInitial? 'visible':'hidden'}}>{errors.middleInitial || 'placeholder'}</div>
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Email:</span>
            <input name="email" type="email" placeholder="email@example.com" value={form.email} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.email? 'visible':'hidden'}}>{errors.email || 'placeholder'}</div>
          </label>
          <label className="field">
            <span>Position:</span>
            <select name="position" value={form.position} onChange={onChange}>
              <option value="">Select Position</option>
              <option value="Midwife">Midwife</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
            </select>
            <div style={{marginTop:4,minHeight:16}} />
          </label>
          <label className="field">
            <span>Phone:</span>
            <PhoneInput value={form.phone} onChange={(v) => setForm((prev) => ({ ...prev, phone: v }))} />
            <div style={{marginTop:4,minHeight:16}} />
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Password:</span>
            <input name="password" type={show ? "text" : "password"} placeholder="Password" value={form.password} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.password? 'visible':'hidden'}}>{errors.password || 'placeholder'}</div>
          </label>
          <label className="field">
            <span>Confirm Password:</span>
            <input name="confirmPassword" type={show ? "text" : "password"} placeholder="Confirm Password" value={form.confirmPassword} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.confirmPassword? 'visible':'hidden'}}>{errors.confirmPassword || 'placeholder'}</div>
          </label>
          <label className="show">
            <input type="checkbox" onChange={(e) => setShow(e.target.checked)} />
            Show Password
          </label>
        </div>

        <div className="actions">
          {showSubmitError ? (
            <div style={{color:'#dc2626',fontSize:13,marginBottom:8}}>Please complete all required fields and fix validation errors.</div>
          ) : null}
          <button
            type="button"
            className="next"
            onClick={async () => {
              ["lastName","firstName","middleInitial","email","password","confirmPassword","position"].forEach((f)=>validate(f, form[f]));
              const required = ["lastName","firstName","middleInitial","email","password","confirmPassword","position"];
              const anyEmpty = required.some(f => !String(form[f]||"").trim());
              if (anyEmpty || form.password !== form.confirmPassword) {
                setShowSubmitError(true);
                return;
              }
              try {
                const res = await fetch('/api/staffs/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify({
                    lastName: form.lastName,
                    firstName: form.firstName,
                    middleInitial: form.middleInitial,
                    position: form.position,
                    email: form.email,
                    password: form.password
                  })
                });
                const data = await res.json();
                if (data && data.success) {
                  alert('Staff account created');
                } else {
                  alert(data?.message || 'Failed to create staff');
                }
              } catch (e) {
                alert('Network error creating staff');
              }
            }}
          >
            Register
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default Staffregister;

