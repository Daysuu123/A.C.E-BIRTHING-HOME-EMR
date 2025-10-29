import React, { useState } from "react";
import "../AdminSide/Patientrecords.css";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../components/StaffLayout";
import StaffPatientRegisterModal from "../components/StaffPatientRegisterModal";

const samplePatients = [
  { id: "E-10001", name: "Amie Eppie", photo: "https://i.pravatar.cc/120?img=5" },
  { id: "C-10001", name: "Dorothea Cari", photo: "https://i.pravatar.cc/120?img=10" },
  { id: "C-10003", name: "Kaylie Celia", photo: "https://i.pravatar.cc/120?img=32" },
  { id: "E-10003", name: "Annalise Elisabeth", photo: "https://i.pravatar.cc/120?img=20" },
  { id: "G-10001", name: "Candice Galilea", photo: "https://i.pravatar.cc/120?img=13" },
  { id: "E-10001", name: "Venetia Vivian", photo: "https://i.pravatar.cc/120?img=47" }
];

function StaffManagePatient() {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <StaffLayout title="Patient Records">
      <div className="toolbar">
        <input 
          className="search" 
          placeholder="Search: Patient ID or Patient Name" 
          style={{ flex: 1, maxWidth: '400px' }}
        />
        <button 
          className="action-btn"
          onClick={() => setShowRegisterModal(true)}
        >
          Register a Patient
        </button>
      </div>

      <div className="cards-grid">
        {samplePatients.map((p) => (
          <article key={p.name} className="card">
            <div className="card-actions">
              <button title="Edit" onClick={() => navigate('/staff/patient-records/edit')}>✎</button>
              <button title="Open">⤢</button>
            </div>
            <img className="avatar" src={p.photo} alt={p.name} />
            <div className="meta">
              <div className="line">Patient ID: {p.id}</div>
              <div className="line">Patient Name: {p.name}</div>
            </div>
            <div className="card-quick">
              <button title="Share">🔗</button>
              <button title="Download">⬇</button>
            </div>
          </article>
        ))}
      </div>

      <StaffPatientRegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </StaffLayout>
  );
}

export default StaffManagePatient;

