import React from "react";
import "./Patientrecords.css";
import { Link, useNavigate } from "react-router-dom";

const samplePatients = [
  { id: "E-10001", name: "Amie Eppie", photo: "https://i.pravatar.cc/120?img=5" },
  { id: "C-10001", name: "Dorothea Cari", photo: "https://i.pravatar.cc/120?img=10" },
  { id: "C-10003", name: "Kaylie Celia", photo: "https://i.pravatar.cc/120?img=32" },
  { id: "E-10003", name: "Annalise Elisabeth", photo: "https://i.pravatar.cc/120?img=20" },
  { id: "G-10001", name: "Candice Galilea", photo: "https://i.pravatar.cc/120?img=13" },
  { id: "E-10001", name: "Venetia Vivian", photo: "https://i.pravatar.cc/120?img=47" }
];

function Patientrecords() {
  const navigate = useNavigate();
  return (
    <div className="records-shell">
      <div className="records-header">
        <div className="gold-line">
          <Link className="back" aria-label="Back" to="/admin/dashboard">←</Link>
        </div>
      </div>

      <section className="records-content">
        <h1 className="records-title">Patient Records</h1>

        <input className="search" placeholder="Search: Patient ID or Patient Name" />

        <div className="cards-grid">
          {samplePatients.map((p) => (
            <article key={p.name} className="card">
              <div className="card-actions">
                <button title="Edit" onClick={() => navigate('/admin/patient-records/edit')}>✎</button>
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

