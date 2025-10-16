import React, { useMemo, useState, useEffect } from "react";
import "./Manageaccs.css";
import { Link, useNavigate } from "react-router-dom";

function Manageaccs() {
  const [patientRows, setPatientRows] = useState([]);
  const [staffRows, setStaffRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'patient' | 'staff'
  const [formData, setFormData] = useState({ name: "", date: "", position: "" });
  const [editingKey, setEditingKey] = useState(null);

  const datePlaceholder = useMemo(() => new Date().toLocaleDateString("en-US"), []);

  useEffect(() => {
    fetchPatients();
    fetchStaff();
  }, []);

  async function fetchPatients() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/patients');
      const data = await response.json();
      
      if (data.success) {
        const formattedPatients = data.patients.map(patient => ({
          id: patient.patient_id,
          email: patient.email,
          name: `${patient.first_name} ${patient.last_name}`,
          date: new Date(patient.date_created).toLocaleDateString("en-US"),
          contact: patient.contact || "N/A",
          address: patient.address || "N/A"
        }));
        setPatientRows(formattedPatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }

  async function fetchStaff() {
    try {
      // For now, using static data. You can create a staff API endpoint later
      const initialStaffRows = [
        { email: "obienjanelle@gmail.com", name: "Obien, Janelle C.", position: "OB-GYN", date: "01/10/2025" },
        { email: "la.anne@example.com", name: "Anne, L.", position: "Midwife", date: "02/05/2025" },
        { email: "l.cruz@example.com", name: "Cruz, L.", position: "Pediatrician", date: "03/22/2025" }
      ];
      setStaffRows(initialStaffRows);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const openModal = (type, key) => {
    setModalType(type);
    setEditingKey(key);
    if (type === "patient") {
      const row = patientRows.find(r => r.email === key);
      setFormData({ name: row?.name || "", date: row?.date || "" });
    } else {
      const row = staffRows.find(r => r.email === key);
      setFormData({ name: row?.name || "", position: row?.position || "", date: row?.date || "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setEditingKey(null);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSave = (e) => {
    e.preventDefault();
    if (modalType === "patient") {
      setPatientRows(prev => prev.map(r => r.email === editingKey ? { ...r, name: formData.name, date: formData.date || r.date } : r));
    } else if (modalType === "staff") {
      setStaffRows(prev => prev.map(r => r.email === editingKey ? { ...r, name: formData.name, position: formData.position, date: formData.date || r.date } : r));
    }
    closeModal();
  };

  return (
    <div className="maccs-shell">
      <div className="gold-line">
        <Link className="back" aria-label="Back" to="/admin/dashboard">←</Link>
      </div>

      <section className="maccs-content">
        <h1 className="title">Manage Accounts</h1>

        <div className="tables-grid">
          <div className="table-block">
            <div className="block-title">Patient Accounts</div>
            <div className="table cols-3">
              <div className="thead">
                <div>Full Name</div>
                <div>Date Created</div>
                <div>Action</div>
              </div>
              {isLoading ? (
                <div className="trow">
                  <div className="name">Loading...</div>
                  <div className="date">-</div>
                  <div className="action">-</div>
                </div>
              ) : patientRows.length === 0 ? (
                <div className="trow">
                  <div className="name">No patients found</div>
                  <div className="date">-</div>
                  <div className="action">-</div>
                </div>
              ) : (
                patientRows.map((r) => (
                  <div className="trow" key={r.id}>
                    <div className="name">{r.name}</div>
                    <div className="date">{r.date}</div>
                    <div className="action">
                      <button className="edit" onClick={() => openModal("patient", r.id)}>View</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="table-block">
            <div className="block-title">Staff Accounts</div>
            <div className="table cols-4">
              <div className="thead">
                <div>Full Name</div>
                <div>Position</div>
                <div>Date Created</div>
                <div>Action</div>
              </div>
              {staffRows.map((r) => (
                <div className="trow" key={r.email}>
                  <div className="name">{r.name}</div>
                  <div className="pos">{r.position}</div>
                  <div className="date">{r.date}</div>
                  <div className="action">
                    <button className="edit" onClick={() => openModal("staff", r.email)}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{modalType === "patient" ? "Edit Patient" : "Edit Staff"}</div>
              <button className="modal-close" aria-label="Close" onClick={closeModal}>×</button>
            </div>
            <form className="modal-body" onSubmit={onSave}>
              <label className="field">
                <span>Full Name</span>
                <input name="name" type="text" value={formData.name} onChange={onChange} required />
              </label>
              {modalType === "staff" ? (
                <label className="field">
                  <span>Position</span>
                  <input name="position" type="text" value={formData.position} onChange={onChange} required />
                </label>
              ) : null}
              <label className="field">
                <span>Date Created</span>
                <input name="date" type="text" value={formData.date} onChange={onChange} placeholder={datePlaceholder} />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <footer className="maccs-footer">
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

export default Manageaccs;