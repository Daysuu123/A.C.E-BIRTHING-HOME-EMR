import React, { useState } from "react";
import "../AdminSide/Patientregister.css";
import { useNavigate } from "react-router-dom";

function PatientRegisterModal({ isOpen, onClose, onComplete }) {
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
      newErrors.password = v ? (pwRegex.test(v) ? "" : "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.") : "Password is required.";
    }
    if (field === "confirmPassword") {
      newErrors.confirmPassword = v ? (v === currentForm.password ? "" : "Passwords do not match.") : "Please confirm your password.";
    }
    setErrors(newErrors);
    return !newErrors[field];
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  }

  async function handleNext() {
    const allFields = ["lastName", "firstName", "middleInitial", "email", "password", "confirmPassword"];
    allFields.forEach(field => validate(field, form[field]));
    
    const anyEmpty = allFields.some(field => !String(form[field] || "").trim());
    const emailOk = emailRegex.test(form.email || "");
    const pwOk = pwRegex.test(form.password || "");
    const matchOk = form.password === form.confirmPassword;
    const namesOk = nameRegex.test(form.lastName || "") && nameRegex.test(form.firstName || "") && miRegex.test(form.middleInitial || "");
    
    const ok = !anyEmpty && emailOk && pwOk && matchOk && namesOk;
    if (!ok) {
      setSubmitError("Please complete all required fields and fix validation errors.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch('/api/patients/register-account', {
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
        // Store patient data for the next step
        localStorage.setItem('tempPatientId', data.patient_id);
        localStorage.setItem('tempPatientData', JSON.stringify(data.patient));

        // If parent provided onComplete, let parent handle next step (open info modal)
        if (typeof onComplete === 'function') {
          onComplete();
        } else {
          // Fallback to previous behavior: close and navigate to info route
          onClose();
          navigate('/admin/patient-register/info');
        }
      } else {
        setSubmitError(data.message || 'Failed to create patient account');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal patient-register-modal">
        <div className="modal-header">
          <div className="modal-title">Patient Registration</div>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
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
        </div>
      </div>
    </div>
  );
}

export default PatientRegisterModal;

