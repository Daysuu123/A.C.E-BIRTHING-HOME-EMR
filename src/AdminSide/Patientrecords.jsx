import React, { useState, useEffect } from "react";
import "./Patientrecords.css";
import { Link, useNavigate } from "react-router-dom";

function Patientrecords() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="records-shell">
      <div className="records-header">
        <div className="gold-line">
          <Link className="back" aria-label="Back" to="/admin/dashboard">←</Link>
        </div>
      </div>

      <section className="records-content">
        <h1 className="records-title">Patient Records</h1>

        <input 
          className="search" 
          placeholder="Search: Patient ID or Patient Name" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
      </section>

      <footer className="records-footer">
        <div className="footer-mark" />
        <div className="mission">
          TO PROVIDE EXCEPTIONAL
          <br />
          MIDWIFERY CARE TO EACH AND
          <br />
          EVERY WOMAN
        </div>
      </footer>
    </div>
  );
}

export default Patientrecords;

