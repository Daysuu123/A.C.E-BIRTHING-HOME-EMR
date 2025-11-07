import React, { useEffect, useMemo, useState, useCallback } from "react";
import "../AdminSide/Patientregister.css";
import "../AdminSide/Addpatientinfo.css";
import PhoneInput from "./PhoneInput";
import phLocations from "../AdminSide/phLocations";

/**
 * EditPatientInfoModal - Enhanced with comprehensive data synchronization
 * Features:
 * - Real-time database schema validation
 * - Change detection for optimized API calls
 * - Enhanced error handling
 * - Consistent data flow patterns
 */

function EditPatientInfoModal({ isOpen, onClose, patientId, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Database schema mapping for real-time validation
  const dbSchema = {
    lastName: { field: 'last_name', type: 'string', maxLength: 255, required: true },
    firstName: { field: 'first_name', type: 'string', maxLength: 255, required: true },
    middleName: { field: 'middle_ini', type: 'string', maxLength: 255, required: true },
    dob: { field: 'bday', type: 'date', required: true },
    marital: { field: 'marital', type: 'string', required: true },
    address: { field: 'address', type: 'string', maxLength: 255, required: true },
    province: { field: 'province', type: 'string', maxLength: 255, required: true },
    city: { field: 'city', type: 'string', maxLength: 255, required: true },
    nationality: { field: 'nationality', type: 'string', maxLength: 255, required: true },
    contact: { field: 'contact', type: 'string', maxLength: 20, required: true },
    emergencyContact: { field: 'emergency', type: 'string', maxLength: 20, required: true },
    fatherName: { field: 'fathers_name', type: 'string', maxLength: 255, required: true },
    fatherContact: { field: 'fathers_con', type: 'string', maxLength: 20, required: true },
    fatherOccupation: { field: 'fathers_ocu', type: 'string', maxLength: 255, required: true },
    fatherAddress: { field: 'fathers_add', type: 'string', maxLength: 255, required: true },
    motherName: { field: 'mother_name', type: 'string', maxLength: 255, required: true },
    motherContact: { field: 'mother_con', type: 'string', maxLength: 20, required: true },
    motherOccupation: { field: 'mother_ocu', type: 'string', maxLength: 255, required: true },
    motherAddress: { field: 'mother_add', type: 'string', maxLength: 255, required: true },
    spouseName: { field: 'spouse_name', type: 'string', maxLength: 255, required: false },
    spouseContact: { field: 'spouse_contact', type: 'string', maxLength: 20, required: false },
    spouseOccupation: { field: 'spouse_ocu', type: 'string', maxLength: 255, required: false }
  };

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    dob: "",
    marital: "",
    address: "",
    province: "",
    city: "",
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

  const nameRegex = /^[A-Za-z ]+$/;
  
  /**
   * Real-time database schema validation
   * Validates field values against database constraints
   */
  const validateAgainstSchema = useCallback((field, value) => {
    const schema = dbSchema[field];
    if (!schema) return "";
    
    // Required field validation
    if (schema.required && (!value || String(value).trim() === "")) {
      return "This field is required.";
    }
    
    // Type validation
    if (value && schema.type === 'string' && typeof value !== 'string') {
      return "Invalid data type.";
    }
    
    // Length validation
    if (value && schema.maxLength && String(value).length > schema.maxLength) {
      return `Maximum ${schema.maxLength} characters allowed.`;
    }
    
    // Date validation
    if (schema.type === 'date' && value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return "Invalid date format.";
      }
      // Prevent future dates
      if (date > new Date()) {
        return "Date cannot be in the future.";
      }
    }
    
    return "";
  }, [dbSchema]);

  /**
   * Change detection function
   * Compares current form data with original data
   */
  const detectChanges = useCallback((currentForm, originalData) => {
    if (!originalData) return true;
    
    const changes = {};
    let hasAnyChanges = false;
    
    Object.keys(dbSchema).forEach(key => {
      const currentValue = String(currentForm[key] || "").trim();
      const originalValue = String(originalData[key] || "").trim();
      
      if (currentValue !== originalValue) {
        changes[key] = { from: originalValue, to: currentValue };
        hasAnyChanges = true;
      }
    });
    
    return { hasChanges: hasAnyChanges, changes };
  }, [dbSchema]);

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
    if (!isOpen) return;
    if (!patientId) {
      setIsLoading(false);
      return;
    }
    
    const fetchPatientData = async () => {
      setLoading(true);
      setSyncError("");
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patients/get-patient-info/${patientId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch patient info: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.patient) {
          const p = data.patient;
          const validatedData = {
            lastName: p.last_name || "",
            firstName: p.first_name || "",
            middleName: p.middle_ini || "",
            dob: p.bday || "",
            marital: p.marital || "",
            address: p.address || "",
            province: p.province || "",
            city: p.city || "",
            nationality: p.nationality || "",
            contact: p.contact || "",
            emergencyContact: p.emergency || "",
            fatherName: p.fathers_name || "",
            fatherContact: p.fathers_con || "",
            fatherOccupation: p.fathers_ocu || "",
            fatherAddress: p.fathers_add || "",
            motherName: p.mother_name || "",
            motherContact: p.mother_con || "",
            motherOccupation: p.mother_ocu || "",
            motherAddress: p.mother_add || "",
            spouseName: p.spouse_name || "",
            spouseContact: p.spouse_contact || "",
            spouseOccupation: p.spouse_ocu || "",
          };
          
          setForm(validatedData);
          setOriginalData({ ...validatedData });
          setHasChanges(false);
          
          console.log("Patient data synchronized:", {
            patientId,
            data: validatedData,
            timestamp: new Date().toISOString()
          });
        } else {
          setSyncError("Failed to load patient data");
        }
      } catch (err) {
        console.error("Data synchronization error:", err);
        
        let errorMessage = "Failed to load patient information.";
        if (err.message.includes("NetworkError")) {
          errorMessage = "Network connection failed.";
        } else if (err.message.includes("404")) {
          errorMessage = "Patient information not found.";
        } else if (err.message.includes("500")) {
          errorMessage = "Server error occurred.";
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setSubmitError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [isOpen, patientId]);

  async function fetchPatientData(id) {
    setLoading(true);
    setSyncError("");
    try {
      const response = await fetch(`/api/patients/${id}/info`);
      const data = await response.json();
      if (data.success && data.patient) {
        const p = data.patient;
        setForm({
          lastName: p.last_name || "",
          firstName: p.first_name || "",
          middleName: p.middle_ini || "",
          dob: p.bday || "",
          marital: p.marital || "",
          address: p.address || "",
          province: p.province || "",
          city: p.city || "",
          nationality: p.nationality || "",
          contact: p.contact || "",
          emergencyContact: p.emergency || "",
          fatherName: p.fathers_name || "",
          fatherContact: p.fathers_con || "",
          fatherOccupation: p.fathers_ocu || "",
          fatherAddress: p.fathers_add || "",
          motherName: p.mother_name || "",
          motherContact: p.mother_con || "",
          motherOccupation: p.mother_ocu || "",
          motherAddress: p.mother_add || "",
          spouseName: p.spouse_name || "",
          spouseContact: p.spouse_contact || "",
          spouseOccupation: p.spouse_ocu || "",
        });
      } else {
        setSyncError("Failed to load patient data");
      }
    } catch (e) {
      setSyncError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const setField = useCallback((name, value) => {
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
    
    // Real-time database schema validation
    const schemaError = validateAgainstSchema(name, value);
    
    // Clear error for this field when user starts typing, but apply schema validation
    setErrors(prev => ({ 
      ...prev, 
      [name]: schemaError || "" 
    }));
    
    // Update change detection
    if (originalData) {
      const changes = detectChanges(next, originalData);
      setHasChanges(changes.hasChanges);
    }
  }, [form, originalData, validateAgainstSchema, detectChanges]);

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

  const handleSave = async () => {
    if (submitting) return;
    
    // Check if any changes were made
    if (!hasChanges) {
      setSyncError("No changes detected. Please modify at least one field to save.");
      setTimeout(() => setSyncError(""), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    setSyncError("");
    
    try {
      // Comprehensive validation against database schema
      const validationErrors = {};
      let hasValidationErrors = false;
      
      // Validate all fields against database schema
      Object.keys(dbSchema).forEach(field => {
        const error = validateAgainstSchema(field, form[field]);
        if (error) {
          validationErrors[field] = error;
          hasValidationErrors = true;
        }
      });
      
      if (hasValidationErrors) {
       setErrors(validationErrors);
       setSubmitting(false);
       return;
     }
      
      // Prepare payload with proper field mapping
      const payload = {
        patient_id: patientId,
        first_name: form.firstName?.trim() || "",
        last_name: form.lastName?.trim() || "",
        middle_ini: form.middleName?.trim() || "",
        bday: form.dob,
        marital: form.marital,
        nationality: form.nationality?.trim() || "",
        province: form.province?.trim() || "",
        city: form.city?.trim() || "",
        address: form.address?.trim() || "",
        contact: form.contact?.trim() || "",
        emergency: form.emergencyContact?.trim() || "",
        father_name: form.fatherName?.trim() || "",
        father_occupation: form.fatherOccupation?.trim() || "",
        father_contact: form.fatherContact?.trim() || "",
        father_address: form.fatherAddress?.trim() || "",
        mother_name: form.motherName?.trim() || "",
        mother_occupation: form.motherOccupation?.trim() || "",
        mother_contact: form.motherContact?.trim() || "",
        mother_address: form.motherAddress?.trim() || "",
        spouse_name: form.spouseName?.trim() || "",
        spouse_occupation: form.spouseOccupation?.trim() || "",
        spouse_contact: form.spouseContact?.trim() || ""
      };
      
      // Log synchronization attempt
      console.log("Synchronizing patient data:", {
        patientId,
        changes: detectChanges(form, originalData).changes,
        timestamp: new Date().toISOString()
      });
      
      const res = await fetch("http://127.0.0.1:8000/api/patients/update-patient-info", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Server error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Update original data with new values
      setOriginalData({ ...form });
      setHasChanges(false);
      
      // Success feedback
      setSyncError("Patient information updated successfully!");
      setTimeout(() => {
        setSyncError("");
        if (onSaved) onSaved();
        if (onClose) onClose();
      }, 1500);
      
    } catch (err) {
      console.error("Synchronization error:", err);
      
      // Enhanced error handling
      let errorMessage = "Failed to synchronize with database.";
      
      if (err.message.includes("NetworkError")) {
        errorMessage = "Network connection failed. Please check your connection.";
      } else if (err.message.includes("404")) {
        errorMessage = "API endpoint not found. Please contact support.";
      } else if (err.message.includes("500")) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setSyncError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ width: "900px", maxWidth: "95vw" }}>
        <div className="modal-header">
          <div className="modal-title">Edit Patient Personal Information</div>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span>Synchronizing patient data...</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Synchronization Status Indicator */}
              {syncError && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${ syncError.includes("successfully") ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700" }`}>
                  <div className="flex items-center space-x-2">
                    {syncError.includes("successfully") ? (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="font-medium">{syncError}</span>
                  </div>
                </div>
              )}
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
                <div className="submit-error" style={{color:'#dc2626',fontSize:13,visibility:syncError? 'visible':'hidden'}}>{syncError || 'placeholder'}</div>
                <div className="flex items-center space-x-3">
                  {/* Change indicator */}
                  {hasChanges && (
                    <div className="flex items-center space-x-2 text-orange-600 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      <span>Unsaved changes</span>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className={hasChanges ? "next" : "btn-secondary"}
                    onClick={handleSave}
                    disabled={submitting || !hasChanges}
                    title={!hasChanges ? "No changes to save" : "Save changes to patient information"}
                  >
                    {submitting ? (
                      <span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Synchronizing...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPatientInfoModal;


