import React, { useState, useEffect } from "react";
import "./Patientrecords.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PatientRegisterModal from "../components/PatientRegisterModal";
import PatientPersonalInfoModal from "../components/PatientPersonalInfoModal";
import EditPatientInfoModal from "../components/EditPatientInfoModal";

function Patientrecords() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [syncData, setSyncData] = useState(null); // Store synchronized data from registration

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      
      if (data.success) {
        const formattedPatients = data.patients.map(patient => ({
          id: patient.patient_id,
          name: `${patient.first_name} ${patient.last_name}`,
          email: patient.email,
          contact: patient.contact || "N/A",
          address: patient.address || "N/A",
          photo: `https://i.pravatar.cc/120?img=${patient.patient_id}`
        }));
        setPatients(formattedPatients);
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
    <AdminLayout title="Patient Records">
      <div className="toolbar">
        <input 
          className="search" 
          placeholder="Search: Patient ID or Patient Name" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                <button title="Edit" onClick={() => { setEditingId(p.id); setShowEditModal(true); }}>✎</button>
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

      <PatientRegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
        onComplete={(registrationData) => {
          try {
            setShowRegisterModal(false);
            
            // Validate registration data before setting sync data
            if (!registrationData || typeof registrationData !== 'object') {
              console.error('Invalid registration data received:', registrationData);
              alert('Registration completed but data synchronization failed. Please fill in the information manually.');
              setShowInfoModal(true);
              return;
            }
            
            // Validate required fields
            if (!registrationData.lastName || !registrationData.firstName || !registrationData.middleName) {
              console.warn('Incomplete registration data:', registrationData);
              alert('Registration completed but some information is missing. Please fill in the remaining fields.');
            }
            
            // Store sync data for personal info modal
            setSyncData(registrationData);
            
            // Log successful data capture for debugging
            console.log('Registration data captured successfully:', {
              lastName: registrationData.lastName,
              firstName: registrationData.firstName,
              middleName: registrationData.middleName
            });
            
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
        onClose={() => { setShowInfoModal(false); setSyncData(null); }} // Clear sync data on close
        onSaved={() => { setShowInfoModal(false); setSyncData(null); fetchPatients(); }} // Clear sync data after save
        syncData={syncData} // Pass synchronized data from registration
      />

      <EditPatientInfoModal
        isOpen={showEditModal}
        patientId={editingId}
        onClose={() => { setShowEditModal(false); setEditingId(null); }}
        onSaved={() => { setShowEditModal(false); setEditingId(null); fetchPatients(); }}
      />
    </AdminLayout>
  );
}

export default Patientrecords;

