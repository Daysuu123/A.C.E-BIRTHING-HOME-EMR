import React, { useEffect, useRef, useState } from "react";
import "./Createrecords.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function Createrecords() {
  const navigate = useNavigate();
  const [staffs, setStaffs] = useState([]);
  const nameRef = useRef();
  const typeRef = useRef();
  const dateRef = useRef();
  const staffRef = useRef();
  const notesRef = useRef();
  const outcomeRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/staffs');
        const data = await res.json();
        if (data && data.success) {
          setStaffs((data.staff || []).map(s => ({ id: s.staff_id, name: `${s.staffs_sur}, ${s.staffs_firs}` })));
        }
      } catch (_) {}
    })();
  }, []);
  
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
  
  return (
    <AdminLayout title="Create Check-up and Deliver Records">
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
    </AdminLayout>
  );
}

export default Createrecords;


