import React, { useState, useEffect } from "react";
import "./Patientrecords.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PatientRegisterModal from "../components/PatientRegisterModal";

function Patientrecords() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/patients');
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
                <button title="Edit" onClick={() => navigate(`/admin/patient-records/edit/${p.id}`)}>✎</button>
                <button title="View Details" onClick={() => navigate(`/admin/patient-records/view/${p.id}`)}>⤢</button>
              </div>
              <img className="avatar" src={p.photo} alt={p.name} />
              <div className="meta">
                <div className="line">Patient ID: {p.id}</div>
                <div className="line">Patient Name: {p.name}</div>
                <div className="line">Email: {p.email}</div>
                <div className="line">Contact: {p.contact}</div>
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
      />
    </AdminLayout>
  );
}

export default Patientrecords;

