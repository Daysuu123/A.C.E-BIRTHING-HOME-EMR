import React, { useMemo, useState, useEffect } from "react";
import "./Manageaccs.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

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
      const response = await fetch('/api/patients');
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
      const response = await fetch('/api/staffs');
      const data = await response.json();
      if (data.success) {
        const formatted = (data.staff || []).map(s => ({
          id: s.staff_id,
          name: `${s.staffs_sur}, ${s.staffs_firs}`,
          position: s.position || 'N/A',
          date: s.date_created ? new Date(s.date_created).toLocaleDateString('en-US') : '-'
        }));
        setStaffRows(formatted);
      } else {
        console.error('Error fetching staff:', data.message);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const toInputDate = (mmddyyyy) => {
    // Converts "MM/DD/YYYY" to "YYYY-MM-DD" for input[type=date]
    if (!mmddyyyy || !/\d{2}\/\d{2}\/\d{4}/.test(mmddyyyy)) return "";
    const [mm, dd, yyyy] = mmddyyyy.split('/');
    return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
  };

  const openModal = (type, key) => {
    setModalType(type);
    setEditingKey(key);
    if (type === "patient") {
      const row = patientRows.find(r => r.id === key);
      setFormData({ name: row?.name || "", date: toInputDate(row?.date), position: "" });
    } else {
      const row = staffRows.find(r => r.id === key);
      setFormData({ name: row?.name || "", position: row?.position || "", date: toInputDate(row?.date) });
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
      setPatientRows(prev => prev.map(r => r.id === editingKey ? { ...r, name: formData.name, date: formData.date || r.date } : r));
    } else if (modalType === "staff") {
      setStaffRows(prev => prev.map(r => r.id === editingKey ? { ...r, name: formData.name, position: formData.position, date: formData.date || r.date } : r));
    }
    closeModal();
  };

  return (
    <AdminLayout title="Manage Accounts">
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
            {isLoading ? (
              <div className="trow">
                <div className="name">Loading...</div>
                <div className="pos">-</div>
                <div className="date">-</div>
                <div className="action">-</div>
              </div>
            ) : staffRows.length === 0 ? (
              <div className="trow">
                <div className="name">No staff found</div>
                <div className="pos">-</div>
                <div className="date">-</div>
                <div className="action">-</div>
              </div>
            ) : (
              staffRows.map((r) => (
                <div className="trow" key={r.id}>
                  <div className="name">{r.name}</div>
                  <div className="pos">{r.position}</div>
                  <div className="date">{r.date}</div>
                  <div className="action">
                    <button className="edit" onClick={() => openModal("staff", r.id)}>View</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
                  <select name="position" value={formData.position} onChange={onChange} required>
                    <option value="">Select Position</option>
                    <option value="Midwife">Midwife</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Admin">Admin</option>
                    <option value="Nurse">Nurse</option>
                  </select>
                </label>
              ) : null}
              <label className="field">
                <span>Date Created</span>
                <input name="date" type="date" value={formData.date || ''} onChange={onChange} placeholder={datePlaceholder} />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

export default Manageaccs;