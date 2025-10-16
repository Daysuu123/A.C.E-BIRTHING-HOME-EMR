import React, { useMemo, useState } from "react";
import phLocations from "./phLocations";
import PhoneInput from "../components/PhoneInput";
import { useNavigate } from "react-router-dom";
import "./Addpatientinfo.css";

function Addpatientinfo() {
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
  const e164Regex = /^\+[1-9]\d{1,14}$/; // E.164 international format

  // Minimal countries dataset for flag dropdown; extend as needed
  const countries = [
    { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭', min: 10, max: 10 },
    { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', min: 10, max: 10 },
    { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬', min: 8, max: 8 },
    { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪', min: 9, max: 9 },
    { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰', min: 8, max: 8 },
    { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵', min: 10, max: 10 },
    { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', min: 9, max: 9 },
    { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', min: 10, max: 10 },
    { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', min: 10, max: 10 },
  ];
  const getCountryByCode = (code) => countries.find(c => c.code === code) || countries[0];
  const getCountryByDial = (dial) => countries.find(c => dial && String(dial).startsWith(c.dial));

  const [countryByField, setCountryByField] = useState({
    contact: 'PH',
    emergencyContact: 'PH',
    fatherContact: 'PH',
    motherContact: 'PH',
    spouseContact: 'PH',
  });

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

  function sanitizeIntlPhone(raw) {
    // keep leading + and digits only; collapse extra +'s
    let v = String(raw || "");
    v = v.replace(/[^+\d]/g, "");
    // keep only first leading +
    v = v.replace(/\+/g, (m, idx) => (idx === 0 ? "+" : ""));
    if (v.startsWith("+")) {
      const digits = v.slice(1).replace(/\D/g, "");
      return "+" + digits;
    }
    // no + yet, keep digits only while typing
    return v.replace(/\D/g, "");
  }

  function normalizeToE164(raw) {
    const digits = String(raw || "").replace(/[^\d]/g, "").replace(/^0+/, "");
    return digits ? "+" + digits : "";
  }

  function setField(name, value) {
    // sanitize and strictly cap to 11 digits total for contact numbers
    if (name === "contact" || name === "emergencyContact" || name === "fatherContact" || name === "motherContact" || name === "spouseContact") {
      let v = sanitizeIntlPhone(value);
      const hasPlus = v.startsWith("+");
      const digits = v.replace(/\D/g, "").slice(0, 11);
      value = hasPlus ? (digits ? "+" + digits : "") : digits;
    }
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
    // clear submit error only when all fields are complete/valid
    const requiredOk = [
      nextForm.lastName,nextForm.firstName,nextForm.middleName,nextForm.dob,nextForm.address,nextForm.pob,nextForm.nationality,nextForm.religion,nextForm.contact,nextForm.emergencyContact,
      nextForm.province,nextForm.city,
      nextForm.fatherName,nextForm.fatherContact,nextForm.fatherOccupation,nextForm.fatherAddress,nextForm.motherName,nextForm.motherContact,nextForm.motherOccupation,nextForm.motherAddress
    ].every(v => String(v||"").trim());
    const phonesOk = [nextForm.contact, nextForm.emergencyContact, nextForm.fatherContact, nextForm.motherContact]
      .every(v => String(v||"").replace(/\D/g, "").length === 11);
    const namesOk = [nextForm.lastName,nextForm.firstName,nextForm.middleName,nextForm.fatherName,nextForm.motherName]
      .every(v => nameRegex.test((v||"")));
    const maritalOk = String(nextForm.marital||"").trim().length > 0;
    if (requiredOk && phonesOk && namesOk && maritalOk) {
      setSubmitError("");
    }
  }

  function finalizePhone(name) {
    const current = form[name] || "";
    const hasPlus = String(current).startsWith("+");
    const digits = String(current).replace(/\D/g, "").slice(0, 11);
    const normalized = digits ? (hasPlus ? "+" + digits : "+" + digits) : "";
    setForm((prev) => ({ ...prev, [name]: normalized }));
    validate(name, normalized);
  }

  function changeCountry(field, code) {
    const selected = getCountryByCode(code);
    setCountryByField((prev) => ({ ...prev, [field]: code }));
    const dial = selected.dial;
    // rebase current value to selected dial
    const current = form[field] || "";
    let digits = current.replace(/[^\d]/g, "");
    // remove any leading country code digits (best-effort); we keep only national part by removing first up to 15-dialDigits
    const other = getCountryByDial(current);
    if (other) {
      const oldDialDigits = other.dial.replace('+','');
      if (digits.startsWith(oldDialDigits)) digits = digits.slice(oldDialDigits.length);
    }
    const national = digits.slice(0, selected.max);
    const next = dial + national;
    setForm((prev)=>({ ...prev, [field]: next }));
    validate(field, next);
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
        next[field] = value && !nameRegex.test(value) ? "Letters and spaces only." : "";
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
        next[field] = req(value);
        break;
      case "motherOccupation":
      case "motherAddress":
        next[field] = req(value);
        break;
      case "spouseOccupation":
        next[field] = value && !nameRegex.test(value) ? "Letters and spaces only." : "";
        break;
      case "contact":
      case "emergencyContact":
      case "fatherContact":
      case "motherContact":
      case "spouseContact": {
        if (!value) { next[field] = "This field is required."; break; }
        const digits = String(value || "").replace(/\D/g, "");
        // require exactly 11 digits total (PH standard), regardless of country selection
        next[field] = digits.length === 11 ? "" : "Must be 11 Digits.";
        break;
      }
        break;
      case "dob":
        next[field] = req(value);
        break;
      case "marital":
        next[field] = req(value);
        break;
      default:
        break;
    }
    setErrors(next);
  }
  const getRole = () => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return "admin";
      const auth = JSON.parse(raw);
      return (auth && auth.role) || "admin";
    } catch (_) {
      return "admin";
    }
  };

  async function handleRegister() {
    // validate required fields before submission
    [
      'lastName','firstName','middleName','dob','address','province','nationality','contact','emergencyContact',
      'fatherName','fatherContact','fatherOccupation','fatherAddress','motherName','motherContact','motherOccupation','motherAddress'
    ].forEach((f)=>validate(f, form[f]));
    
    const requiredOk = [
      form.lastName,form.firstName,form.middleName,form.dob,form.address,form.province,form.nationality,form.contact,form.emergencyContact,
      form.fatherName,form.fatherContact,form.fatherOccupation,form.fatherAddress,form.motherName,form.motherContact,form.motherOccupation,form.motherAddress
    ].every(v => String(v||"").trim());
    
    const phonesOk = [form.contact, form.emergencyContact, form.fatherContact, form.motherContact]
      .every(v => String(v||"").replace(/\D/g, "").length === 11);
    
    const namesOk = [form.lastName,form.firstName,form.middleName,form.fatherName,form.motherName].every(v => nameRegex.test((v||"")));
    
    if (!requiredOk || !phonesOk || !namesOk) {
      setSubmitError("Please complete all required fields and fix validation errors.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const patientId = localStorage.getItem('tempPatientId');
      if (!patientId) {
        setSubmitError("Patient account not found. Please start registration again.");
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/patients/register-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        // Clear temporary data
        localStorage.removeItem('tempPatientId');
        localStorage.removeItem('tempPatientData');
        
        const role = getRole();
        const dest = role === 'staff' ? '/staff/landing' : '/admin/patient-records';
        navigate(dest, { replace: true });
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
  const shouldShow = (name) => {
    const v = String(form[name] || "").trim();
    return !!touched[name] || !!v;
  };
  return (
    <div className="addpat-shell">
      <div className="gold-line">
        <button
          className="back"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
      </div>

      <section className="addpat-content">
        <h1 className="title">Patient Personal Information</h1>

        <form className="addpat-form">
          {/* Personal Details Section */}
          <div className="form-section">
            <div className="row">
              <label className="field">
                <span>Last Name (Maiden's):</span>
                <input type="text" required name="lastName" value={form.lastName} onChange={(e)=>setField("lastName", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.lastName && shouldShow('lastName')? 'visible':'hidden'}}>{errors.lastName || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>First Name:</span>
                <input type="text" required name="firstName" value={form.firstName} onChange={(e)=>setField("firstName", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.firstName && shouldShow('firstName')? 'visible':'hidden'}}>{errors.firstName || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Middle Name:</span>
                <input type="text" required name="middleName" value={form.middleName} onChange={(e)=>setField("middleName", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.middleName && shouldShow('middleName')? 'visible':'hidden'}}>{errors.middleName || 'placeholder'}</div>
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Date of Birth:</span>
                <input type="date" name="dob" value={form.dob} onChange={(e)=>{ setField("dob", e.target.value); setForm((p)=>({ ...p, age: "" })); }} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.dob && shouldShow('dob')? 'visible':'hidden'}}>{errors.dob || 'placeholder'}</div>
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
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.marital && shouldShow('marital')? 'visible':'hidden'}}>{errors.marital || 'placeholder'}</div>
              </div>
            </div>

            <div className="row">
              <label className="field wide">
                <span>Address:</span>
                <input type="text" required name="address" value={form.address} onChange={(e)=>setField("address", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.address && shouldShow('address')? 'visible':'hidden'}}>{errors.address || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Place of Birth:</span>
                <input type="text" required name="pob" value={form.pob} onChange={(e)=>setField("pob", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.pob && shouldShow('pob')? 'visible':'hidden'}}>{errors.pob || 'placeholder'}</div>
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
                    const requiredOk = [
                      next.lastName,next.firstName,next.middleName,next.dob,next.address,next.pob,next.nationality,next.religion,next.contact,next.emergencyContact,
                      next.province,next.city,
                      next.fatherName,next.fatherContact,next.fatherOccupation,next.fatherAddress,next.motherName,next.motherContact,next.motherOccupation,next.motherAddress
                    ].every(v => String(v||"").trim());
                    const phonesOk = [next.contact, next.emergencyContact, next.fatherContact, next.motherContact]
                      .every(v => String(v||"").replace(/\D/g, "").length === 11);
                    const namesOk = [next.lastName,next.firstName,next.middleName,next.fatherName,next.motherName]
                      .every(v => nameRegex.test((v||"")));
                    const maritalOk = String(next.marital||"").trim().length > 0;
                    if (requiredOk && phonesOk && namesOk && maritalOk) setSubmitError("");
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
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.nationality && shouldShow('nationality')? 'visible':'hidden'}}>{errors.nationality || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Religion:</span>
                <input type="text" required name="religion" value={form.religion} onChange={(e)=>setField("religion", e.target.value)} pattern="[A-Za-z ]+" />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.religion && shouldShow('religion')? 'visible':'hidden'}}>{errors.religion || 'placeholder'}</div>
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Contact:</span>
                <PhoneInput value={form.contact} onChange={(v)=>setField('contact', v)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.contact && shouldShow('contact')? 'visible':'hidden'}}>{errors.contact || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Emergency Contact:</span>
                <PhoneInput value={form.emergencyContact} onChange={(v)=>setField('emergencyContact', v)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.emergencyContact && shouldShow('emergencyContact')? 'visible':'hidden'}}>{errors.emergencyContact || 'placeholder'}</div>
              </label>
            </div>

            {/* Removed Social Security# and Philhealth# as requested - inputs and their error messages deleted */}
          </div>

          {/* Father's Information Section */}
          <div className="form-section">
            <h3 className="section-title">Father's Information</h3>
            <div className="row">
              <label className="field">
                <span>Father's Name:</span>
                <input type="text" required name="fatherName" value={form.fatherName} onChange={(e)=>setField("fatherName", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherName && shouldShow('fatherName')? 'visible':'hidden'}}>{errors.fatherName || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Contact:</span>
                <PhoneInput value={form.fatherContact} onChange={(v)=>setField('fatherContact', v)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherContact && shouldShow('fatherContact')? 'visible':'hidden'}}>{errors.fatherContact || 'placeholder'}</div>
              </label>
            </div>
            <div className="row">
              <label className="field">
                <span>Occupation:</span>
                <input type="text" required name="fatherOccupation" value={form.fatherOccupation} onChange={(e)=>setField("fatherOccupation", e.target.value)} pattern="[A-Za-z ]+" />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherOccupation && shouldShow('fatherOccupation')? 'visible':'hidden'}}>{errors.fatherOccupation || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Father's Address:</span>
                <input type="text" required name="fatherAddress" value={form.fatherAddress} onChange={(e)=>setField("fatherAddress", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.fatherAddress && shouldShow('fatherAddress')? 'visible':'hidden'}}>{errors.fatherAddress || 'placeholder'}</div>
              </label>
            </div>
          </div>

          {/* Mother's Information Section */}
          <div className="form-section">
            <h3 className="section-title">Mother's Information</h3>
            <div className="row">
              <label className="field">
                <span>Mother's Name:</span>
                <input type="text" required name="motherName" value={form.motherName} onChange={(e)=>setField("motherName", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherName && shouldShow('motherName')? 'visible':'hidden'}}>{errors.motherName || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Contact:</span>
                <PhoneInput value={form.motherContact} onChange={(v)=>setField('motherContact', v)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherContact && shouldShow('motherContact')? 'visible':'hidden'}}>{errors.motherContact || 'placeholder'}</div>
              </label>
            </div>
            <div className="row">
              <label className="field">
                <span>Occupation:</span>
                <input type="text" required name="motherOccupation" value={form.motherOccupation} onChange={(e)=>setField("motherOccupation", e.target.value)} pattern="[A-Za-z ]+" />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherOccupation && shouldShow('motherOccupation')? 'visible':'hidden'}}>{errors.motherOccupation || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Mother's Address:</span>
                <input type="text" required name="motherAddress" value={form.motherAddress} onChange={(e)=>setField("motherAddress", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.motherAddress && shouldShow('motherAddress')? 'visible':'hidden'}}>{errors.motherAddress || 'placeholder'}</div>
              </label>
            </div>
          </div>

          {/* Spouse Information Section */}
          <div className="form-section">
            <h3 className="section-title">Spouse Information</h3>
            <div className="row">
              <label className="field">
                <span>Spouse:</span>
                <input type="text" name="spouseName" value={form.spouseName} onChange={(e)=>setField("spouseName", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseName && shouldShow('spouseName')? 'visible':'hidden'}}>{errors.spouseName || 'placeholder'}</div>
              </label>
              <label className="field">
                <span>Contact:</span>
                <PhoneInput value={form.spouseContact} onChange={(v)=>setField('spouseContact', v)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseContact && shouldShow('spouseContact')? 'visible':'hidden'}}>{errors.spouseContact || 'placeholder'}</div>
              </label>
            </div>
            <div className="row">
              <label className="field">
                <span>Occupation:</span>
                <input type="text" name="spouseOccupation" value={form.spouseOccupation} onChange={(e)=>setField("spouseOccupation", e.target.value)} pattern="[A-Za-z ]+" />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseOccupation && shouldShow('spouseOccupation')? 'visible':'hidden'}}>{errors.spouseOccupation || 'placeholder'}</div>
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

      <footer className="addpat-footer">
        <div className="footer-mark" />
        <div className="mission">
          TO PROVIDE EXCEPTIONAL
          <br />
          MIDWIFERY CARE TO EACH AND
          <br />
          EVERY WOMAN
        </div>
      </footer>
    </div>
  );
}

export default Addpatientinfo;
