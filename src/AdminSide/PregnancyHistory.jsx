import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import './AdminTables.css';

function PregnancyHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recordsSearchText, setRecordsSearchText] = useState('');
  const [recordsQuery, setRecordsQuery] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    gravida: '',
    para: '',
    full_term_pregnancies: '',
    preterm_deliveries: '',
    abortions: '',
    living_children: '',
    last_menstrual_period: '',
  });

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pregnancy-histories');
      if (!res.ok) throw new Error('Failed to load pregnancy histories');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);
  useEffect(() => { (async () => { try { await loadPatients(); } catch (_) {} })(); }, []);

  const patientMap = React.useMemo(() => {
    const map = new Map();
    patients.forEach((p) => {
      const key = p.id ?? p.patient_id;
      if (key != null) map.set(key, p);
    });
    return map;
  }, [patients]);

  const filteredItems = React.useMemo(() => {
    if (!recordsQuery) return items;
    const q = recordsQuery.toLowerCase();
    return items.filter((it) => {
      const p = patientMap.get(it.patient_id);
      const name = p ? getPatientDisplayName(p).toLowerCase() : '';
      const idStr = String(it.patient_id).toLowerCase();
      return name.includes(q) || idStr.includes(q);
    });
  }, [recordsQuery, items, patientMap]);

  const getPatientDisplayName = (p) => {
    if (!p) return '';
    const mi = p.middle_ini ? ` ${p.middle_ini}` : '';
    return `${p.first_name}${mi} ${p.last_name}`;
  };

  const loadPatients = async () => {
    setSearching(true);
    setError('');
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

  const onSearch = async () => {
    if (patients.length === 0) await loadPatients();
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchResults([]); return; }
    const results = patients.filter((p) => {
      const name = `${p.first_name || ''} ${p.middle_ini || ''} ${p.last_name || ''}`.toLowerCase();
      const email = (p.email || '').toLowerCase();
      return name.includes(q) || email.includes(q) || String(p.patient_id || p.id).includes(q);
    });
    setSearchResults(results);
  };

  const selectPatient = (p) => {
    setSelectedPatient(p);
    const pid = p.id ?? p.patient_id; // prefer primary id, fallback to patient_id
    setForm((prev) => ({ ...prev, patient_id: pid }));
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        patient_id: Number(form.patient_id),
        gravida: Number(form.gravida),
        para: Number(form.para),
        full_term_pregnancies: Number(form.full_term_pregnancies),
        preterm_deliveries: Number(form.preterm_deliveries),
        abortions: Number(form.abortions),
        living_children: Number(form.living_children),
        last_menstrual_period: form.last_menstrual_period,
      };
      const res = await fetch('/api/pregnancy-histories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create pregnancy history');
      setForm({
        patient_id: '', gravida: '', para: '', full_term_pregnancies: '',
        preterm_deliveries: '', abortions: '', living_children: '', last_menstrual_period: '',
      });
      await fetchItems();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(`/api/pregnancy-histories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete entry');
      await fetchItems();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AdminLayout title="Pregnancy History">
      <div className="subtitle">Manage pregnancy history records</div>

      {error && (
        <div style={{ background:'#fff2f2', border:'1px solid #fca5a5', color:'#991b1b', padding:12, borderRadius:6, marginBottom:12 }}>
          {error}
        </div>
      )}

      <section className="card" style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:6, padding:16, marginBottom:16 }}>
        <h2 style={{ marginTop:0 }}>Add Pregnancy History</h2>
        <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12 }}>
          <div style={{ gridColumn:'1 / -1', display:'grid', gap:8 }}>
            <div style={{ fontWeight:600 }}>Patient</div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <select
                value={form.patient_id}
                onChange={(e) => {
                  const pid = e.target.value;
                  setForm((prev) => ({ ...prev, patient_id: pid }));
                  const p = patients.find((pp) => String(pp.id ?? pp.patient_id) === String(pid));
                  setSelectedPatient(p || null);
                }}
              >
                <option value="">Select a patient...</option>
                {patients.map((p) => (
                  <option key={(p.id ?? p.patient_id)} value={(p.id ?? p.patient_id)}>
                    {getPatientDisplayName(p)} (ID: {p.id ?? p.patient_id})
                  </option>
                ))}
              </select>
              {searching && <span>Loading patients...</span>}
            </div>
          </div>
          <label>
            <div>Gravida</div>
            <input type="number" name="gravida" value={form.gravida} onChange={handleChange} required />
          </label>
          <label>
            <div>Para</div>
            <input type="number" name="para" value={form.para} onChange={handleChange} required />
          </label>
          <label>
            <div>Full Term Pregnancies</div>
            <input type="number" name="full_term_pregnancies" value={form.full_term_pregnancies} onChange={handleChange} required />
          </label>
          <label>
            <div>Preterm Deliveries</div>
            <input type="number" name="preterm_deliveries" value={form.preterm_deliveries} onChange={handleChange} required />
          </label>
          <label>
            <div>Abortions</div>
            <input type="number" name="abortions" value={form.abortions} onChange={handleChange} required />
          </label>
          <label>
            <div>Living Children</div>
            <input type="number" name="living_children" value={form.living_children} onChange={handleChange} required />
          </label>
          <label>
            <div>Last Menstrual Period</div>
            <input type="date" name="last_menstrual_period" value={form.last_menstrual_period} onChange={handleChange} required />
          </label>
          <div style={{ gridColumn:'1 / -1', display:'flex', gap:8 }}>
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={() => setForm({ patient_id:'', gravida:'', para:'', full_term_pregnancies:'', preterm_deliveries:'', abortions:'', living_children:'', last_menstrual_period:'' })}>Clear</button>
          </div>
        </form>
      </section>

      <section className="card" style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:6, padding:16 }}>
        <h2 style={{ marginTop:0 }}>Existing Records</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
          <input
            type="text"
            placeholder="Search records by patient name or ID"
            value={recordsSearchText}
            onChange={(e) => setRecordsSearchText(e.target.value)}
          />
          <button type="button" onClick={() => setRecordsQuery(recordsSearchText.trim())}>Search</button>
          <button type="button" onClick={() => { setRecordsSearchText(''); setRecordsQuery(''); }}>Clear</button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Gravida</th>
                <th>Para</th>
                <th>Full Term</th>
                <th>Preterm</th>
                <th>Abortions</th>
                <th>Living</th>
                <th>LMP</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{(() => {
                    const p = patients.find((pp) => (pp.id === it.patient_id) || (pp.patient_id === it.patient_id));
                    return p ? getPatientDisplayName(p) : it.patient_id;
                  })()}</td>
                  <td>{it.gravida}</td>
                  <td>{it.para}</td>
                  <td>{it.full_term_pregnancies}</td>
                  <td>{it.preterm_deliveries}</td>
                  <td>{it.abortions}</td>
                  <td>{it.living_children}</td>
                  <td>{it.last_menstrual_period}</td>
                  <td>
                    <button onClick={() => handleDelete(it.id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign:'center', padding:12 }}>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default PregnancyHistory;