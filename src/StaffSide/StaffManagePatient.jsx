import React, { useState, useEffect } from "react";
import "../AdminSide/Patientrecords.css";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../components/StaffLayout";
import StaffPatientRegisterModal from "../components/StaffPatientRegisterModal";
import PatientPersonalInfoModal from "../components/PatientPersonalInfoModal";
import EditPatientInfoModal from "../components/EditPatientInfoModal";

function StaffManagePatient() {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [syncData, setSyncData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
                <button
                  title="Edit"
                  onClick={() => { setEditingId(p.id); setShowEditModal(true); }}
                >
                  ✎
                </button>
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
        onComplete={(registrationData) => {
          try {
            setShowRegisterModal(false);

            // Basic validation and mapping as in Admin flow
            if (!registrationData || typeof registrationData !== 'object') {
              console.error('Invalid registration data received:', registrationData);
              alert('Registration completed but data synchronization failed. Please fill in the information manually.');
              setShowInfoModal(true);
              return;
            }

            if (!registrationData.lastName || !registrationData.firstName || !registrationData.middleName) {
              console.warn('Incomplete registration data:', registrationData);
              alert('Registration completed but some information is missing. Please fill in the remaining fields.');
            }

            setSyncData(registrationData);
            setShowInfoModal(true);
          } catch (error) {
            console.error('Error handling registration completion:', error);
            alert('An error occurred during registration completion. Please fill in the information manually.');
            setShowInfoModal(true);
          }
        }}
      />

      <PatientPersonalInfoModal
        isOpen={showInfoModal}
        onClose={() => { setShowInfoModal(false); setSyncData(null); }}
        onSaved={() => { setShowInfoModal(false); setSyncData(null); fetchPatients(); }}
        syncData={syncData}
      />

      <EditPatientInfoModal
        isOpen={showEditModal}
        patientId={editingId}
        onClose={() => { setShowEditModal(false); setEditingId(null); }}
        onSaved={() => { setShowEditModal(false); setEditingId(null); fetchPatients(); }}
      />
    </StaffLayout>
  );
}

export default StaffManagePatient;

