import React, { useEffect, useRef, useState } from "react";
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
  const [staffs, setStaffs] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        // Load staffs
        const resStaffs = await fetch('/api/staffs');
        const dataStaffs = await resStaffs.json();
        if (dataStaffs && dataStaffs.success) {
          setStaffs((dataStaffs.staff || []).map(s => ({ id: s.staff_id, name: `${s.staffs_sur}, ${s.staffs_firs}` })));
        }

        // Load patients
        const resPatients = await fetch('/api/patients');
        const dataPatients = await resPatients.json();
        if (dataPatients && dataPatients.success) {
          const list = dataPatients.patients || [];
          setPatients(list.map(p => ({
            id: p.patient_id,
            name: `${p.last_name}, ${p.first_name}${p.middle_ini ? ' ' + p.middle_ini + '.' : ''}`
          })));
        }
      } catch (_) {}
    })();
  }, [isOpen]);
  
  // Real patients are loaded from the backend when the modal opens

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
              <select defaultValue="" ref={nameRef}>
                <option value="" disabled>Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              </label>

            <div className="row">
              <label className="field">
                <span>Record Type:</span>
                <select defaultValue="" ref={typeRef}>
                  <option>Prenatal</option>
                  <option>Postnatal</option>
                  <option>Delivery</option>
                </select>
              </label>

              <label className="field">
                <span>Date:</span>
                <input type="date" defaultValue="" ref={dateRef} />
              </label>

              <label className="field">
                <span>Attending Staff</span>
                <select defaultValue="" ref={staffRef}>
                  <option value="" disabled>Select Staff</option>
                  {staffs.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field wide">
              <span>Notes</span>
              <input type="text" defaultValue="" ref={notesRef} />
            </label>

            <div className="row">
              <label className="field wide">
                <span>Outcome</span>
                <textarea rows={3} defaultValue="" ref={outcomeRef} />
              </label>

              <div className="actions">
                <button
                  type="button"
                  className="create"
                  onClick={async () => {
                    const payload = {
                      patient_name: nameRef.current?.value || '',
                      record_type: typeRef.current?.value || '',
                      date: dateRef.current?.value || '',
                      attending_staff: staffRef.current?.value ? Number(staffRef.current.value) : undefined,
                      notes: notesRef.current?.value || '',
                      outcome: outcomeRef.current?.value || ''
                    };
                    try {
                      const res = await fetch('/api/records', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      const data = await res.json();
                      if (data && data.success) {
                        onClose();
                        navigate("/admin/checkup-records", { replace: true });
                      } else {
                        alert(data?.message || 'Failed to create record');
                      }
                    } catch(_) {
                      alert('Network error creating record');
                    }
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

