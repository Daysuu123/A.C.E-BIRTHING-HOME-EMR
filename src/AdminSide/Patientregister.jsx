import React, { useState } from "react";
import "./Patientregister.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function Patientregister() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({ lastName: "", firstName: "", middleInitial: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const nameRegex = /^[A-Za-z]+$/;
  const miRegex = /^[A-Za-z]$/;

  function validate(field, value, currentForm = { ...form, [field]: value }) {
    const newErrors = { ...errors };
    const v = (value || "").trim();
    if (field === "lastName" || field === "firstName") {
      newErrors[field] = v ? (nameRegex.test(v) ? "" : "Letters only.") : "This field is required.";
    }
    if (field === "middleInitial") {
      newErrors.middleInitial = v ? (miRegex.test(v) ? "" : "Single letter only.") : "This field is required.";
    }
    if (field === "email") {
      newErrors.email = v ? (emailRegex.test(v) ? "" : "Enter a valid email.") : "Email is required.";
    }
    if (field === "password") {
      newErrors.password = pwRegex.test(v) ? "" : "At least 8 chars, 1 uppercase, 1 number, 1 special.";
      // keep confirm match up to date (only if both have values)
      if (currentForm.confirmPassword) {
        newErrors.confirmPassword = v && currentForm.confirmPassword
          ? (currentForm.confirmPassword === v ? "" : "Passwords do not match.")
          : "";
      }
    }
    if (field === "confirmPassword") {
      // show mismatch only when both fields are non-empty
      if (!v || !currentForm.password) {
        newErrors.confirmPassword = "";
      } else {
        newErrors.confirmPassword = v === currentForm.password ? "" : "Passwords do not match.";
      }
    }
    setErrors(newErrors);
  }

  function onChange(e) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    validate(name, value, next);
    setSubmitError("");
  }

  async function handleNext() {
    if (!validateAll()) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/patients/register-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastName: form.lastName,
          firstName: form.firstName,
          middleInitial: form.middleInitial,
          email: form.email,
          password: form.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store patient_id in localStorage for the next step
        localStorage.setItem('tempPatientId', data.patient_id);
        localStorage.setItem('tempPatientData', JSON.stringify({
          lastName: form.lastName,
          firstName: form.firstName,
          middleInitial: form.middleInitial,
          email: form.email
        }));
        navigate("/admin/patient-register/info");
      } else {
        setSubmitError(data.message || "Failed to create patient account");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function validateAll() {
    const fields = ["lastName","firstName","middleInitial","email","password","confirmPassword"];
    const nextErrors = { ...errors };
    fields.forEach((f) => validate(f, form[f], form));
    // after validate calls, errors state will update async; compute simple pass now
    const anyEmpty = fields.some((f) => !String(form[f] || "").trim());
    const emailOk = emailRegex.test((form.email || "").trim());
    const pwOk = pwRegex.test(form.password || "");
    const matchOk = form.password === form.confirmPassword && !!form.confirmPassword;
    const ok = !anyEmpty && emailOk && pwOk && matchOk;
    if (!ok) setSubmitError("Please complete all required fields and fix validation errors.");
    return ok;
  }

  return (
    <AdminLayout title="Patient Registration">
      <form className="form">
        <div className="row">
          <label className="field">
            <span>Last Name:</span>
            <input name="lastName" type="text" required value={form.lastName} onChange={onChange} pattern="[A-Za-z]+" />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.lastName? 'visible':'hidden'}}>{errors.lastName || 'placeholder'}</div>
          </label>
          <label className="field">
            <span>First Name:</span>
            <input name="firstName" type="text" required value={form.firstName} onChange={onChange} pattern="[A-Za-z]+" />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.firstName? 'visible':'hidden'}}>{errors.firstName || 'placeholder'}</div>
          </label>
          <label className="field">
            <span>Middle Initial:</span>
            <input name="middleInitial" type="text" required value={form.middleInitial} onChange={onChange} maxLength={1} pattern="[A-Za-z]" />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.middleInitial? 'visible':'hidden'}}>{errors.middleInitial || 'placeholder'}</div>
          </label>
        </div>

        <div className="row">
          <label className="field wide">
            <span>Email:</span>
            <input name="email" type="email" required value={form.email} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.email? 'visible':'hidden'}}>{errors.email || 'placeholder'}</div>
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Password:</span>
            <input name="password" type={show ? "text" : "password"} required value={form.password} onChange={onChange} pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}" />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.password? 'visible':'hidden'}}>{errors.password || 'placeholder'}</div>
          </label>
          <label className="field">
            <span>Confirm Password:</span>
            <input name="confirmPassword" type={show ? "text" : "password"} required minLength={8} value={form.confirmPassword} onChange={onChange} />
            <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.confirmPassword? 'visible':'hidden'}}>{errors.confirmPassword || 'placeholder'}</div>
          </label>
          <label className="show">
            <input type="checkbox" onChange={(e) => setShow(e.target.checked)} />
            Show Password
          </label>
        </div>

        <div className="actions">
          <button
            type="button"
            className="next"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Next"}
          </button>
          <div style={{color:'#dc2626',fontSize:13,marginTop:8,minHeight:18,visibility:submitError? 'visible':'hidden'}}>{submitError || 'placeholder'}</div>
        </div>
      </form>
    </AdminLayout>
  );
}

export default Patientregister;


