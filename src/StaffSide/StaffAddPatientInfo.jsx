import React, { useMemo, useState, useEffect } from "react";
import phLocations from "../AdminSide/phLocations";
import PhoneInput from "../components/PhoneInput";
import { useNavigate } from "react-router-dom";
import "./StaffAddPatientInfo.css";
import StaffLayout from "../components/StaffLayout";

function StaffAddPatientInfo() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    dob: "",
    age: "",
    marital: "",
    address: "",
    pob: "",
    province: "",
    city: "",
    nationality: "",
    religion: "",
    contact: "",
    emergencyContact: "",
    fatherName: "",
    fatherContact: "",
    fatherOccupation: "",
    fatherAddress: "",
    motherName: "",
    motherContact: "",
    motherOccupation: "",
    motherAddress: "",
    spouseName: "",
    spouseContact: "",
    spouseOccupation: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");

  const nameRegex = /^[A-Za-z ]+$/;
  const phone9Digits = (v) => String(v || "").replace(/\D/g, "").length === 9;

  useEffect(() => {
    const newErrors = {};
    if (touched.spouseName && !nameRegex.test(form.spouseName)) {
      newErrors.spouseName = "Spouse name must contain only letters and spaces.";
    }
    if (touched.spouseOccupation && !nameRegex.test(form.spouseOccupation)) {
      newErrors.spouseOccupation = "Spouse occupation must contain only letters and spaces.";
    }
    setErrors(newErrors);
  }, [form.spouseName, form.spouseOccupation, touched.spouseName, touched.spouseOccupation]);

  const calculatedAge = useMemo(() => {
    if (!form.dob) return "";
    const b = new Date(form.dob);
    if (Number.isNaN(b.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return String(Math.max(0, age));
  }, [form.dob]);

  function setField(name, value) {
    setForm({ ...form, [name]: value });
  }

  async function handleRegister() {
    // Validation logic here
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const patientId = localStorage.getItem('tempPatientId');
      if (!patientId) {
        setSubmitError("Patient account not found. Please start registration again.");
        return;
      }

      const response = await fetch('/api/patients/register-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: parseInt(patientId),
          ...form
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('tempPatientId');
        navigate('/staff/manage-patient', { replace: true });
      } else {
        setSubmitError(data.message || "Failed to save patient information");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <StaffLayout>
      <section className="addpatient-info-container">
        <form className="addpatient-info-form">
          {/* Spouse Information Section */}
          <div className="form-section">
            <h3 className="section-title">Spouse Information</h3>
            <div className="row">
              <label className="field">
                  <span>Spouse:</span>
                  <input type="text" required pattern="[A-Za-z ]+" name="spouseName" value={form.spouseName} onChange={(e)=>setField("spouseName", e.target.value)} onBlur={() => setTouched({...touched, spouseName: true})} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseName? 'visible':'hidden'}}>{errors.spouseName || 'placeholder'}</div>
                </label>
              <label className="field">
                <span>Contact:</span>
                <PhoneInput value={form.spouseContact} onChange={(v)=>setField('spouseContact', v)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseContact? 'visible':'hidden'}}>{errors.spouseContact || 'placeholder'}</div>
              </label>
            </div>
            <div className="row">
              <label className="field">
                <span>Occupation:</span>
                <input type="text" required pattern="[A-Za-z ]+" name="spouseOccupation" value={form.spouseOccupation} onChange={(e)=>setField("spouseOccupation", e.target.value)} onBlur={() => setTouched({...touched, spouseOccupation: true})} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseOccupation? 'visible':'hidden'}}>{errors.spouseOccupation || 'placeholder'}</div>
              </label>
            </div>
          </div>

          <div className="actions">
            <div className="submit-error" style={{visibility:submitError? 'visible':'hidden'}}>{submitError || 'placeholder'}</div>
            <button
              type="button"
              className="register"
              onClick={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Register"}
            </button>
          </div>
        </form>
      </section>
    </StaffLayout>
  );
}

export default StaffAddPatientInfo;