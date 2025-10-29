import React, { useRef } from "react";
import "../AdminSide/Createrecords.css";
import { useNavigate } from "react-router-dom";

function CreateRecordsModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const nameRef = useRef();
  const typeRef = useRef();
  const dateRef = useRef();
  const staffRef = useRef();
  const notesRef = useRef();
  const outcomeRef = useRef();
  
  // Mock female patient names for dropdown
  const femalePatients = [
    "Eppie, Amie P.",
    "Santos, Maria L.",
    "Reyes, Sofia G.",
    "Cruz, Isabella M.",
    "Garcia, Gabriela T.",
    "Lim, Jasmine R.",
    "Tan, Angela D.",
    "Mendoza, Camille P.",
    "Fernandez, Diana L.",
    "Ramos, Victoria S."
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal create-records-modal">
        <div className="modal-header">
          <div className="modal-title">Create Check-up and Deliver Records</div>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <form className="cr-form">
            <label className="field wide">
              <span>Patient Name:</span>
              <select defaultValue="Eppie, Amie P." ref={nameRef}>
                {femalePatients.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </label>

            <div className="row">
              <label className="field">
                <span>Record Type:</span>
                <select defaultValue="Prenatal" ref={typeRef}>
                  <option>Prenatal</option>
                  <option>Postnatal</option>
                  <option>Delivery</option>
                </select>
              </label>

              <label className="field">
                <span>Date:</span>
                <input type="date" defaultValue="2025-09-18" ref={dateRef} />
              </label>

              <label className="field">
                <span>Attending Staff</span>
                <select defaultValue="Dr. Selby Loren" ref={staffRef}>
                  <option>Dr. Selby Loren</option>
                  <option>Midwife L. Anne</option>
                  <option>Dr. L. Cruz</option>
                </select>
              </label>
            </div>

            <label className="field wide">
              <span>Notes</span>
              <input type="text" defaultValue="High Bp detected" ref={notesRef} />
            </label>

            <div className="row">
              <label className="field wide">
                <span>Outcome</span>
                <textarea rows={3} defaultValue="Continue Monitoring" ref={outcomeRef} />
              </label>

              <div className="actions">
                <button
                  type="button"
                  className="create"
                  onClick={() => {
                    const rec = {
                      name: nameRef.current?.value || '',
                      type: typeRef.current?.value || '',
                      date: (()=>{try{const d=dateRef.current?.value; if(!d) return ''; const dt=new Date(d); return dt.toLocaleDateString('en-US');}catch(_){return ''}})(),
                      staff: staffRef.current?.value || '',
                      notes: notesRef.current?.value || '',
                      outcome: outcomeRef.current?.value || ''
                    };
                    try {
                      const raw = localStorage.getItem('checkup_records');
                      const arr = raw ? JSON.parse(raw) : [];
                      const next = Array.isArray(arr) ? arr : [];
                      next.push(rec);
                      localStorage.setItem('checkup_records', JSON.stringify(next));
                    } catch(_) {}
                    onClose();
                    navigate("/admin/checkup-records", { replace: true });
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRecordsModal;

