import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import phLocations from "./phLocations";
import PhoneInput from "../components/PhoneInput";
import "./Addpatientinfo.css";

function Editpatientinfo() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    dob: "",
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
  const phone11Digits = (v) => String(v || "").replace(/\D/g, "").length === 11;

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
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
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
      case "nationality":
      case "religion":
      case "fatherOccupation":
      case "fatherAddress":
      case "motherOccupation":
      case "motherAddress":
        next[field] = req(value);
        if (["nationality","religion","fatherOccupation","motherOccupation"].includes(field) && value) {
          next[field] = nameRegex.test(value) ? "" : "Letters and spaces only.";
        }
        break;
      case "contact":
      case "emergencyContact":
      case "fatherContact":
      case "motherContact":
      case "spouseContact": {
        if (!value) { next[field] = "This field is required."; break; }
        next[field] = phone11Digits(value) ? "" : "Must be 11 Digits.";
        break;
      }
      case "dob":
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
        <h1 className="title">Edit Patient Personal Information</h1>

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
                <input type="date" name="dob" value={form.dob} onChange={(e)=>setField("dob", e.target.value)} />
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
                <select value={form.province || ''} onChange={(e)=>{ const val = e.target.value; setForm((prev)=>({ ...prev, province: val, city: '' })); setTouched((prev)=>({ ...prev, province: true })); validate('province', val); }}>
                  <option value="" disabled>Select Province</option>
                  {phLocations.provinces.map((p)=> (<option key={p} value={p}>{p}</option>))}
                </select>
              </label>
              <label className="field">
                <span>Town/City:</span>
                <select value={form.city || ''} onChange={(e)=>setField('city', e.target.value)} disabled={!form.province}>
                  <option value="" disabled>{form.province ? 'Select Town/City' : 'Select Province first'}</option>
                  {(phLocations.citiesByProvince[form.province] || []).map((c)=> (<option key={c} value={c}>{c}</option>))}
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
            {/* SSS/Philhealth removed */}
          </div>

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

          <div className="form-section">
            <h3 className="section-title">Spouse Information</h3>
            <div className="row">
              <label className="field">
                <span>Spouse:</span>
                <input type="text" name="spouseName" value={form.spouseName} onChange={(e)=>setField("spouseName", e.target.value)} />
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseName? 'visible':'hidden'}}>{errors.spouseName || 'placeholder'}</div>
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
                <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.spouseOccupation? 'visible':'hidden'}}>{errors.spouseOccupation || 'placeholder'}</div>
              </label>
            </div>
          </div>

          <div className="actions">
            <div className="submit-error" style={{visibility:submitError? 'visible':'hidden'}}>{submitError || 'placeholder'}</div>
            <button
              type="button"
              className="register"
              onClick={() => {
                [
                  'lastName','firstName','middleName','dob','address','pob','nationality','religion','contact','emergencyContact',
                  'fatherName','fatherContact','fatherOccupation','fatherAddress','motherName','motherContact','motherOccupation','motherAddress'
                ].forEach((f)=>validate(f, form[f]));
                const requiredOk = [
                  form.lastName,form.firstName,form.middleName,form.dob,form.address,form.pob,form.nationality,form.religion,form.contact,form.emergencyContact,
                  form.province,form.city,
                  form.fatherName,form.fatherContact,form.fatherOccupation,form.fatherAddress,form.motherName,form.motherContact,form.motherOccupation,form.motherAddress
                ].every(v => String(v||"").trim());
                const phonesOk = [form.contact, form.emergencyContact, form.fatherContact, form.motherContact]
                  .every(v => String(v||"").replace(/\D/g, "").length === 11);
                const namesOk = [form.lastName,form.firstName,form.middleName,form.fatherName,form.motherName]
                  .every(v => nameRegex.test((v||"")));
                const ok = requiredOk && phonesOk && namesOk && String(form.marital||"").trim();
                if (ok) {
                  setShowConfirm(true);
                } else {
                  setSubmitError("Please complete all required fields and fix validation errors.");
                }
              }}
            >
              Save
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

      {showConfirm ? (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 20, width: 360, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Save Edit?</h3>
            <p style={{ marginTop: 0, color: '#374151', fontSize: 14 }}>Do you want to save the changes to this patient's information?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const role = getRole();
                  const dest = role === 'staff' ? '/staff/manage-patient' : '/admin/patient-records';
                  navigate(dest, { replace: true });
                }}
                style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Editpatientinfo;


