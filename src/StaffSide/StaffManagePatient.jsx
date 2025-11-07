import React, { useState, useEffect } from "react";
import "../AdminSide/Patientrecords.css";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../components/StaffLayout";
import StaffPatientRegisterModal from "../components/StaffPatientRegisterModal";

function StaffManagePatient() {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      // Use relative path so Vite dev server proxy (configured in vite.config.js)
      // forwards requests to the Laravel backend at http://127.0.0.1:8000
      const response = await fetch('/api/patients');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.patients || data.data) {
        const patientsData = data.patients || data.data;
        const formattedPatients = patientsData.map(patient => ({
          id: patient.patient_id || patient.id,
          name: `${patient.first_name || patient.name || ''} ${patient.last_name || ''}`.trim(),
          email: patient.email || '',
          contact: patient.contact || patient.phone || "N/A",
          address: patient.address || "N/A",
          photo: `https://i.pravatar.cc/120?img=${patient.patient_id || patient.id || 1}`
        }));
        setPatients(formattedPatients);
      } else {
        console.error('Unexpected data structure from /api/patients:', data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toString().includes(searchTerm)
  );

  return (
    <StaffLayout title="Patient Records">
      <div className="toolbar">
        <input 
          className="search" 
          placeholder="Search: Patient ID or Patient Name" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
        {isLoading ? (
          <div className="card">
            <div className="meta">
              <div className="line">Loading patients...</div>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="card">
            <div className="meta">
              <div className="line">No patients found</div>
            </div>
          </div>
        ) : (
          filteredPatients.map((p) => (
            <article key={p.id} className="card">
              <div className="card-actions">
                <button title="Edit" onClick={() => navigate(`/staff/patient-records/edit/${p.id}`)}>✎</button>
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
          ))
        )}
      </div>

      <StaffPatientRegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </StaffLayout>
  );
}

export default StaffManagePatient;

