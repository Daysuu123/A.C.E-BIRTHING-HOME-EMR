import React, { useMemo, useState } from "react";
import "../AdminSide/Patientregister.css";
import "../AdminSide/Addpatientinfo.css";
import PhoneInput from "./PhoneInput";
import phLocations from "../AdminSide/phLocations";

function PatientPersonalInfoModal({ isOpen, onClose, onSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    dob: "",
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
    if (name === "contact" || name === "emergencyContact" || name === "fatherContact" || name === "motherContact" || name === "spouseContact") {
      let v = String(value || "");
      v = v.replace(/[^+\d]/g, "");
      v = v.replace(/\+/g, (m, idx) => (idx === 0 ? "+" : ""));
      const digits = v.replace(/\D/g, "").slice(0, 11);
      value = v.startsWith("+") ? (digits ? "+" + digits : "") : digits;
    }
    const next = { ...form, [name]: value };
    setForm(next);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  }

  function validate(field, rawValue) {
    const value = (rawValue ?? form[field] ?? "").trim();
    const next = { ...errors };
    const req = (v) => (v ? "" : "This field is required.");
    switch (field) {
      case "lastName":
      case "firstName":
      case "middleName":
      case "fatherName":
      case "motherName":
        next[field] = req(value) || (nameRegex.test(value) ? "" : "Letters and spaces only.");
        break;
      case "spouseName":
        next[field] = (value ? "" : "This field is required.") || (nameRegex.test(value) ? "" : "Letters and spaces only.");
        break;
      case "address":
      case "pob":
        next[field] = req(value);
        break;
      case "nationality":
      case "religion":
        next[field] = req(value) || (nameRegex.test(value) ? "" : "Letters and spaces only.");
        break;
      case "fatherOccupation":
      case "fatherAddress":
      case "motherOccupation":
      case "motherAddress":
        next[field] = req(value);
        break;
      case "spouseOccupation":
        next[field] = (value ? "" : "This field is required.") || (nameRegex.test(value) ? "" : "Letters and spaces only.");
        break;
      case "contact":
      case "emergencyContact":
      case "fatherContact":
      case "motherContact":
      case "spouseContact": {
        if (!value) { next[field] = "This field is required."; break; }
        const digits = String(value || "").replace(/\D/g, "");
        next[field] = digits.length === 11 ? "" : "Must be 11 Digits.";
        break;
      }
      case "dob":
      case "marital":
      case "province":
      case "city":
        next[field] = req(value);
        break;
      default:
        break;
    }
    setErrors(next);
  }

  async function handleSave() {
    [
      "lastName","firstName","middleName","dob","marital","address","pob","province","city",
      "nationality","religion","contact","emergencyContact",
      "fatherName","fatherContact","fatherOccupation","fatherAddress",
      "motherName","motherContact","motherOccupation","motherAddress"
    ].forEach((f) => validate(f, form[f]));

    const requiredOk = [
      form.lastName,form.firstName,form.middleName,form.dob,form.marital,form.address,form.pob,form.province,form.city,
      form.nationality,form.religion,form.contact,form.emergencyContact,
      form.fatherName,form.fatherContact,form.fatherOccupation,form.fatherAddress,
      form.motherName,form.motherContact,form.motherOccupation,form.motherAddress,
      form.spouseName,form.spouseOccupation
    ].every(v => String(v||"").trim());

    const phonesOk = [form.contact, form.emergencyContact, form.fatherContact, form.motherContact]
      .every(v => String(v||"").replace(/\D/g, "").length === 11);

    const namesOk = [form.lastName,form.firstName,form.middleName,form.fatherName,form.motherName,form.spouseName]
      .every(v => nameRegex.test((v||"")));

    if (!requiredOk || !phonesOk || !namesOk) {
      setSubmitError("Please complete all required fields and fix validation errors.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const patientId = localStorage.getItem("tempPatientId");
      if (!patientId) {
        setSubmitError("Patient account not found. Please start registration again.");
        return;
      }
      const response = await fetch('/api/patients/register-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: parseInt(patientId),
          lastName: form.lastName,
          firstName: form.firstName,
          middleName: form.middleName,
          dob: form.dob,
          address: form.address,
          province: form.province,
          nationality: form.nationality,
          contact: form.contact,
          emergencyContact: form.emergencyContact,
          fatherName: form.fatherName,
          fatherContact: form.fatherContact,
          fatherOccupation: form.fatherOccupation,
          fatherAddress: form.fatherAddress,
          motherName: form.motherName,
          motherContact: form.motherContact,
          motherOccupation: form.motherOccupation,
          motherAddress: form.motherAddress,
          spouseName: form.spouseName || "",
          spouseContact: form.spouseContact || "",
          spouseOccupation: form.spouseOccupation || ""
        })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem('tempPatientId');
        localStorage.removeItem('tempPatientData');
        if (onSaved) onSaved();
        if (onClose) onClose();
      } else {
        setSubmitError(data.message || "Failed to save patient information");
      }
    } catch (err) {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ width: "900px", maxWidth: "95vw" }}>
        <div className="modal-header">
          <div className="modal-title">Patient Personal Information</div>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form className="addpat-form">
            <div className="form-section">
              <div className="row">
                <label className="field">
                  <span>Last Name (Maiden's):</span>
                  <input type="text" required name="lastName" value={form.lastName} onChange={(e)=>setField("lastName", e.target.value)} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.lastName? 'visible':'hidden'}}>{errors.lastName || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>First Name:</span>
                  <input type="text" required name="firstName" value={form.firstName} onChange={(e)=>setField("firstName", e.target.value)} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.firstName? 'visible':'hidden'}}>{errors.firstName || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Middle Name:</span>
                  <input type="text" required name="middleName" value={form.middleName} onChange={(e)=>setField("middleName", e.target.value)} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.middleName? 'visible':'hidden'}}>{errors.middleName || 'placeholder'}</div>
                </label>
              </div>

              <div className="row">
                <label className="field">
                  <span>Date of Birth:</span>
                  <input type="date" name="dob" value={form.dob} onChange={(e)=>{ setField("dob", e.target.value); }} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.dob? 'visible':'hidden'}}>{errors.dob || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Age:</span>
                  <input type="text" readOnly value={calculatedAge} />
                  <div style={{marginTop:4,minHeight:16}} />
                </label>
                <div className="field radio-group">
                  <span>{!form.marital ? (<span style={{color:'#dc2626'}}>* </span>) : null}Marital Status:</span>
                  <div className="radio-options">
                    <label><input type="radio" name="marital" checked={form.marital==='Single'} onChange={()=>setField('marital','Single')} /> Single</label>
                    <label><input type="radio" name="marital" checked={form.marital==='Married'} onChange={()=>setField('marital','Married')} /> Married</label>
                    <label><input type="radio" name="marital" checked={form.marital==='Widowed'} onChange={()=>setField('marital','Widowed')} /> Widowed</label>
                    <label><input type="radio" name="marital" checked={form.marital==='Divorced'} onChange={()=>setField('marital','Divorced')} /> Divorced</label>
                  </div>
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.marital? 'visible':'hidden'}}>{errors.marital || 'placeholder'}</div>
                </div>
              </div>

              <div className="row">
                <label className="field wide">
                  <span>Address:</span>
                  <input type="text" required name="address" value={form.address} onChange={(e)=>setField("address", e.target.value)} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.address? 'visible':'hidden'}}>{errors.address || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Place of Birth:</span>
                  <input type="text" required name="pob" value={form.pob} onChange={(e)=>setField("pob", e.target.value)} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.pob && (touched.pob||form.pob)? 'visible':'hidden'}}>{errors.pob || 'placeholder'}</div>
                </label>
              </div>

              <div className="row">
                <label className="field">
                  <span>Province:</span>
                  <select
                    value={form.province}
                    onChange={(e)=>{
                      const val = e.target.value;
                      const next = { ...form, province: val, city: '' };
                      setForm(next);
                      setTouched((prev)=>({ ...prev, province: true }));
                      validate('province', val);
                    }}
                  >
                    <option value="" disabled>Select Province</option>
                    {phLocations.provinces.map((p)=> (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Town/City:</span>
                  <select
                    value={form.city}
                    onChange={(e)=>{
                      const val = e.target.value;
                      setField('city', val);
                    }}
                    disabled={!form.province}
                  >
                      <option value="" disabled>{form.province ? 'Select Town/City' : 'Select Province first'}</option>
                    {(phLocations.citiesByProvince[form.province] || []).map((c)=> (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="row">
                <label className="field">
                  <span>Nationality:</span>
                  <input type="text" required name="nationality" value={form.nationality} onChange={(e)=>setField("nationality", e.target.value)} pattern="[A-Za-z ]+" />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.nationality? 'visible':'hidden'}}>{errors.nationality || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Religion:</span>
                  <input type="text" required name="religion" value={form.religion} onChange={(e)=>setField("religion", e.target.value)} pattern="[A-Za-z ]+" />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.religion? 'visible':'hidden'}}>{errors.religion || 'placeholder'}</div>
                </label>
              </div>

              <div className="row">
                <label className="field">
                  <span>Contact:</span>
                  <PhoneInput value={form.contact} onChange={(v)=>setField('contact', v)} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.contact? 'visible':'hidden'}}>{errors.contact || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Emergency Contact:</span>
                  <PhoneInput value={form.emergencyContact} onChange={(v)=>setField('emergencyContact', v)} />
                  <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.emergencyContact? 'visible':'hidden'}}>{errors.emergencyContact || 'placeholder'}</div>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Father's Information</h3>
              <div className="row">
                <label className="field">
                  <span>Father's Name:</span>
                  <input type="text" required name="fatherName" value={form.fatherName} onChange={(e)=>setField("fatherName", e.target.value)} />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherName? 'visible':'hidden'}}>{errors.fatherName || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Contact:</span>
                  <PhoneInput value={form.fatherContact} onChange={(v)=>setField('fatherContact', v)} />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherContact? 'visible':'hidden'}}>{errors.fatherContact || 'placeholder'}</div>
                </label>
              </div>
              <div className="row">
                <label className="field">
                  <span>Occupation:</span>
                  <input type="text" required name="fatherOccupation" value={form.fatherOccupation} onChange={(e)=>setField("fatherOccupation", e.target.value)} pattern="[A-Za-z ]+" />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherOccupation? 'visible':'hidden'}}>{errors.fatherOccupation || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Father's Address:</span>
                  <input type="text" required name="fatherAddress" value={form.fatherAddress} onChange={(e)=>setField("fatherAddress", e.target.value)} />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherAddress? 'visible':'hidden'}}>{errors.fatherAddress || 'placeholder'}</div>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Mother's Information</h3>
              <div className="row">
                <label className="field">
                  <span>Mother's Name:</span>
                  <input type="text" required name="motherName" value={form.motherName} onChange={(e)=>setField("motherName", e.target.value)} />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherName? 'visible':'hidden'}}>{errors.motherName || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Contact:</span>
                  <PhoneInput value={form.motherContact} onChange={(v)=>setField('motherContact', v)} />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherContact? 'visible':'hidden'}}>{errors.motherContact || 'placeholder'}</div>
                </label>
              </div>
              <div className="row">
                <label className="field">
                  <span>Occupation:</span>
                  <input type="text" required name="motherOccupation" value={form.motherOccupation} onChange={(e)=>setField("motherOccupation", e.target.value)} pattern="[A-Za-z ]+" />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherOccupation? 'visible':'hidden'}}>{errors.motherOccupation || 'placeholder'}</div>
                </label>
                <label className="field">
                  <span>Mother's Address:</span>
                  <input type="text" required name="motherAddress" value={form.motherAddress} onChange={(e)=>setField("motherAddress", e.target.value)} />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherAddress? 'visible':'hidden'}}>{errors.motherAddress || 'placeholder'}</div>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Spouse Information</h3>
              <div className="row">
                <label className="field">
                  <span>Spouse:</span>
                  <input type="text" required pattern="[A-Za-z ]+" name="spouseName" value={form.spouseName} onChange={(e)=>setField("spouseName", e.target.value)} />
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
                  <input type="text" required pattern="[A-Za-z ]+" name="spouseOccupation" value={form.spouseOccupation} onChange={(e)=>setField("spouseOccupation", e.target.value)} />
                    <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseOccupation? 'visible':'hidden'}}>{errors.spouseOccupation || 'placeholder'}</div>
                </label>
              </div>
            </div>

            <div className="actions" style={{ marginTop: 16 }}>
              <div className="submit-error" style={{color:'#dc2626',fontSize:13,visibility:submitError? 'visible':'hidden'}}>{submitError || 'placeholder'}</div>
              <button type="button" className="next" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientPersonalInfoModal;


