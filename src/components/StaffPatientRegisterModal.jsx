import React, { useState } from "react";
import "../AdminSide/Patientregister.css";
import { useNavigate } from "react-router-dom";
import { postJson } from "../lib/api";

function StaffPatientRegisterModal({ isOpen, onClose, onComplete }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ lastName: "", firstName: "", middleInitial: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    // password fields removed
    setErrors(newErrors);
    return !newErrors[field];
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  }

  function validateAll() {
    const allFields = ["lastName", "firstName", "middleInitial", "email"];
    allFields.forEach(field => validate(field, form[field]));
    
    const anyEmpty = allFields.some(field => !String(form[field] || "").trim());
    const emailOk = emailRegex.test(form.email || "");
    const namesOk = nameRegex.test(form.lastName || "") && nameRegex.test(form.firstName || "") && miRegex.test(form.middleInitial || "");
    
    const ok = !anyEmpty && emailOk && namesOk;
    if (!ok) {
      setSubmitError("Please complete all required fields and fix validation errors.");
      return false;
    }
    setSubmitError("");
    return true;
  }

  async function handleNext() {
    if (!validateAll()) return;

    setIsSubmitting(true);

  try {
      const payload = {
        lastName: (form.lastName || ''),
        firstName: (form.firstName || ''),
        middleInitial: (form.middleInitial || ''),
        email: (form.email || '')
      };

      const { data, ok } = await postJson('/patients/register-account', payload);

      if (data && (data.success || ok)) {
        // Store patient data for the next step
        localStorage.setItem('tempPatientId', data.patient_id);
        localStorage.setItem('tempPatientData', JSON.stringify(data.patient));

        // Prefer parent-driven flow like PatientRegisterModal to open info modal
        const registrationData = {
          lastName: (form.lastName || '').trim(),
          firstName: (form.firstName || '').trim(),
          middleName: (form.middleInitial || '').trim(),
          patientId: data.patient_id
        };

        if (typeof onComplete === 'function') {
          try {
            onComplete(registrationData);
          } catch (_) {
            // Fallback: just close modal on error
            onClose();
          }
        } else {
          // Fallback: close the modal and stay on the same page
          // (do NOT navigate to a non-existent route which could look like logout)
          onClose();
        }
      } else {
        const message =
          (data && data.message) ||
          (data?.errors ? Object.values(data.errors)[0] : null) ||
          'Failed to create patient account';
        setSubmitError(message);
      }
    } catch (error) {
      setSubmitError('Network error. Please ensure the backend is running.');
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

            {/* password fields removed */}

            <div className="actions">
              <button
                type="button"
                className="next"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
              <div style={{color:'#dc2626',fontSize:13,marginTop:8,minHeight:18,visibility:submitError? 'visible':'hidden'}}>{submitError || 'placeholder'}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StaffPatientRegisterModal;

