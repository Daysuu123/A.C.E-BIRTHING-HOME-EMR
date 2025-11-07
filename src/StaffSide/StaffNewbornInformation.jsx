import React, { useEffect, useMemo, useState } from "react";
import StaffLayout from "../components/StaffLayout";
import '../AdminSide/Staffregister.css';
import '../AdminSide/Patientrecords.css';
import '../AdminSide/Admindashboard.css';

function StaffNewbornInformation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recordsSearchText, setRecordsSearchText] = useState("");
  const [recordsQuery, setRecordsQuery] = useState("");
  const [form, setForm] = useState({
    patient_id: "",
    delivery_record_id: "",
    gender: "",
    weight: "",
    length: "",
    complications: "",
  });

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newborn-information");
      if (!res.ok) throw new Error("Failed to load newborn information");
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // Load patients for dropdown and name mapping
  useEffect(() => { (async () => { try { await loadPatients(); } catch (_) {} })(); }, []);

  const getPatientDisplayName = (p) => {
    if (!p) return "";
    const mi = p.middle_ini ? ` ${p.middle_ini}` : "";
    return `${p.first_name}${mi} ${p.last_name}`;
  };

  const loadPatients = async () => {
    setSearching(true);
    setError("");
    try {
      const res = await fetch('/api/patients');
      if (!res.ok) throw new Error('Failed to load patients');
      const data = await res.json();
      const list = data.patients || data || [];
      setPatients(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setSearching(false);
    }
  };

  const patientMap = useMemo(() => {
    const map = new Map();
    patients.forEach((p) => {
      const key = p.id ?? p.patient_id;
      if (key != null) map.set(key, p);
    });
    return map;
  }, [patients]);

  const filteredItems = useMemo(() => {
    if (!recordsQuery) return items;
    const q = recordsQuery.toLowerCase();
    return items.filter((it) => {
      const p = patientMap.get(it.patient_id);
      const name = p ? getPatientDisplayName(p).toLowerCase() : '';
      const idStr = String(it.patient_id).toLowerCase();
      return name.includes(q) || idStr.includes(q);
    });
  }, [recordsQuery, items, patientMap]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        patient_id: Number(form.patient_id),
        delivery_record_id: Number(form.delivery_record_id),
        gender: form.gender,
        weight: Number(form.weight),
        length: Number(form.length),
        complications: form.complications || null,
      };
      const res = await fetch("/api/newborn-information", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create newborn information");
      setForm({ patient_id:"", delivery_record_id:"", gender:"", weight:"", length:"", complications:"" });
      await fetchItems();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      const res = await fetch(`/api/newborn-information/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");
      await fetchItems();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <StaffLayout title="Newborn Information">
      <div className="subtitle">Manage newborn information records</div>

      {error && (
        <div style={{ background: "#fff2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: 12, borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <label className="field">
            <span>Patient</span>
            <select name="patient_id" value={form.patient_id} onChange={handleChange} required>
              <option value="">Select a patient...</option>
              {patients.map((p) => (
                <option key={(p.id ?? p.patient_id)} value={(p.id ?? p.patient_id)}>
                  {getPatientDisplayName(p)} (ID: {p.id ?? p.patient_id})
                </option>
              ))}
            </select>
            {searching && <div style={{ fontSize:12 }}>Loading patients...</div>}
          </label>
          <label className="field">
            <span>Delivery Record ID</span>
            <input type="number" name="delivery_record_id" value={form.delivery_record_id} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Gender</span>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Weight (kg)</span>
            <input type="number" step="0.01" name="weight" value={form.weight} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Length (cm)</span>
            <input type="number" step="0.01" name="length" value={form.length} onChange={handleChange} required />
          </label>
          <label className="field wide">
            <span>Complications</span>
            <textarea name="complications" value={form.complications} onChange={handleChange} rows={3} />
          </label>
        </div>

        <div className="actions">
          <button type="submit" className="next">Save</button>
          <button
            type="button"
            className="clear-btn"
            onClick={() => setForm({ patient_id:"", delivery_record_id:"", gender:"", weight:"", length:"", complications:"" })}
          >
            Clear
          </button>
        </div>
      </form>

      <section className="card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Existing Records</h2>
        <div className="toolbar">
          <input
            className="search"
            type="text"
            placeholder="Search: Patient ID or Patient Name"
            value={recordsSearchText}
            onChange={(e) => setRecordsSearchText(e.target.value)}
          />
          <button className="action-btn" type="button" onClick={() => setRecordsQuery(recordsSearchText.trim())}>Search</button>
          <button className="action-btn" type="button" onClick={() => { setRecordsSearchText(''); setRecordsQuery(''); }}>Clear</button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Delivery</th>
                <th>Gender</th>
                <th>Weight</th>
                <th>Length</th>
                <th>Complications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{(() => { const p = patientMap.get(it.patient_id); return p ? getPatientDisplayName(p) : '-'; })()}</td>
                  <td>{it.patient_id}</td>
                  <td>{it.delivery_record_id}</td>
                  <td>{it.gender}</td>
                  <td>{it.weight}</td>
                  <td>{it.length}</td>
                  <td>{it.complications || '-'}</td>
                  <td>
                    <button onClick={() => handleDelete(it.id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 12 }}>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </StaffLayout>
  );
}

export default StaffNewbornInformation;