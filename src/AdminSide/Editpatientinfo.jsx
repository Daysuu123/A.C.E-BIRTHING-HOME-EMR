import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import phLocations from "./phLocations";
import PhoneInput from "../components/PhoneInput";
import "./Addpatientinfo.css";
import AdminLayout from "../components/AdminLayout";

function Editpatientinfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    dob: "",
    address: "",
    province: "",
    nationality: "",
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

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  async function fetchPatientData() {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/patients/${id}/info`);
      const data = await response.json();
      
      if (data.success && data.patient) {
        const patient = data.patient;
        setForm({
          lastName: patient.last_name || "",
          firstName: patient.first_name || "",
          middleName: patient.middle_ini || "",
          dob: patient.bday || "",
          address: patient.address || "",
          province: patient.province || "",
          nationality: patient.nationality || "",
          contact: patient.contact || "",
          emergencyContact: patient.emergency || "",
          fatherName: patient.fathers_name || "",
          fatherContact: patient.fathers_con || "",
          fatherOccupation: patient.fathers_ocu || "",
          fatherAddress: patient.fathers_add || "",
          motherName: patient.mother_name || "",
          motherContact: patient.mother_con || "",
          motherOccupation: patient.mother_ocu || "",
          motherAddress: patient.mother_add || "",
          spouseName: patient.spouse_name || "",
          spouseContact: patient.spouse_contact || "",
          spouseOccupation: patient.spouse_ocu || "",
        });
      } else {
        setSubmitError("Failed to load patient data");
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function setField(name, value) {
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
    const requiredOk = [
      nextForm.lastName,nextForm.firstName,nextForm.middleName,nextForm.dob,nextForm.address,nextForm.province,nextForm.nationality,nextForm.contact,nextForm.emergencyContact,
      nextForm.fatherName,nextForm.fatherContact,nextForm.fatherOccupation,nextForm.fatherAddress,nextForm.motherName,nextForm.motherContact,nextForm.motherOccupation,nextForm.motherAddress
    ].every(v => String(v||"").trim());
    const phonesOk = [nextForm.contact, nextForm.emergencyContact, nextForm.fatherContact, nextForm.motherContact]
      .every(v => String(v||"").replace(/\D/g, "").length === 11);
    const namesOk = [nextForm.lastName,nextForm.firstName,nextForm.middleName,nextForm.fatherName,nextForm.motherName]
      .every(v => nameRegex.test((v||"")));
    if (requiredOk && phonesOk && namesOk) {
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
      case "nationality":
      case "fatherOccupation":
      case "fatherAddress":
      case "motherOccupation":
      case "motherAddress":
        next[field] = req(value);
        if (["nationality","fatherOccupation","motherOccupation"].includes(field) && value) {
          next[field] = nameRegex.test(value) ? "" : "Letters and spaces only.";
        }
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


  async function handleSave() {
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
      const response = await fetch(`http://127.0.0.1:8000/api/patients/${id}/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        const role = getRole();
        const dest = role === 'staff' ? '/staff/manage-patient' : '/admin/patient-records';
        navigate(dest, { replace: true });
      } else {
        setSubmitError(data.message || "Failed to update patient information");
      }
    } catch (error) {
      console.error('Update error:', error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="Edit Patient Personal Information">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading patient data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Patient Personal Information">
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
          </div>

          <div className="row">
            <label className="field">
              <span>Province:</span>
              <select value={form.province || ''} onChange={(e)=>{ const val = e.target.value; setForm((prev)=>({ ...prev, province: val })); setTouched((prev)=>({ ...prev, province: true })); validate('province', val); }}>
                <option value="" disabled>Select Province</option>
                {phLocations.provinces.map((p)=> (<option key={p} value={p}>{p}</option>))}
              </select>
            </label>
            <label className="field">
              <span>Nationality:</span>
              <input type="text" required name="nationality" value={form.nationality} onChange={(e)=>setField("nationality", e.target.value)} pattern="[A-Za-z ]+" />
              <div style={{color:'#dc2626',fontSize:12,marginTop:4,minHeight:16,visibility:errors.nationality && shouldShow('nationality')? 'visible':'hidden'}}>{errors.nationality || 'placeholder'}</div>
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
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default Editpatientinfo;


