import React, { useState } from "react";
import PhoneInput from "../components/PhoneInput";
import "./Staffregister.css";
import { Link, useNavigate } from "react-router-dom";

function Editstaffaccount() {
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({ lastName: "", firstName: "", middleInitial: "", email: "", phone: "", position: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showSubmitError, setShowSubmitError] = useState(false);

  const nameRegex = /^[A-Za-z ]+$/;
  const miRegex = /^[A-Za-z]$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
  const phoneRegex = /^[0-9]{9}$/;
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
      case "phone":
        next.phone = v ? (phoneRegex.test(v) ? "" : "Must be 9 digits.") : "This field is required.";
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
    const fields = ["lastName","firstName","middleInitial","email","phone","password","confirmPassword"];
    const allFilled = fields.every(f => String(next[f]||"").trim());
    const allValid =
      nameRegex.test(next.lastName||"") &&
      nameRegex.test(next.firstName||"") &&
      miRegex.test(next.middleInitial||"") && (String(next.middleInitial||"").length === 1) &&
      emailRegex.test(next.email||"") &&
      phoneRegex.test(next.phone||"") &&
      pwRegex.test(next.password||"") &&
      next.password === next.confirmPassword;
    if (allFilled && allValid) {/* nothing extra */}
  }

  function validateAll() {
    const fields = ["lastName","firstName","middleInitial","email","phone","password","confirmPassword"];
    fields.forEach((f) => validate(f, form[f]));
    const allEmpty = fields.every(f => !String(form[f]||"").trim());
    setShowSubmitError(allEmpty);
    
    const allFilled = fields.every(f => String(form[f]||"").trim());
    const allValid =
      nameRegex.test(form.lastName||"") &&
      nameRegex.test(form.firstName||"") &&
      miRegex.test(form.middleInitial||"") && (String(form.middleInitial||"").length === 1) &&
      emailRegex.test(form.email||"") &&
      phoneRegex.test(form.phone||"") &&
      pwRegex.test(form.password||"") &&
      form.password === form.confirmPassword;
      
    return allFilled && allValid;
  }

  return (
    <div className="sreg-shell">
      <div className="gold-line">
        <Link className="back" aria-label="Back" to="/admin/manage-accounts">←</Link>
      </div>

      <section className="sreg-content">
        <h1 className="title">Edit Staff Account</h1>

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
              <select name="position" value={form.position || ""} onChange={onChange}>
                <option value="">{form.position ? form.position : "Select Position"}</option>
                <option value="Midwife">Midwife</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
                <option value="Nurse">Nurse</option>
              </select>
              <div style={{marginTop:4,minHeight:16}} />
            </label>
            <label className="field">
              <span>Phone:</span>
              <PhoneInput value={form.phone} onChange={(v) => onChange({ target: { name: 'phone', value: v }})} />
              <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.phone? 'visible':'hidden'}}>{errors.phone || 'placeholder'}</div>
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
              onClick={() => {
                if (validateAll()) {
                  setConfirm(true);
                }
              }}
            >
              Save
            </button>
          </div>
        </form>
      </section>

      <footer className="sreg-footer">
        <div className="footer-mark" />
        <div className="mission">
          TO PROVIDE EXCEPTIONAL
          <br />
          MIDWIFERY CARE TO EACH AND
          <br />
          EVERY WOMAN
        </div>
      </footer>

      {confirm ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 20, width: 360, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Save Edit?</h3>
            <p style={{ marginTop: 0, color: '#374151', fontSize: 14 }}>Do you want to save the changes to this staff account?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
              <button onClick={() => setConfirm(false)} style={{ background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => navigate('/admin/manage-accounts', { replace: true })} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Editstaffaccount;


