import React, { useEffect, useMemo, useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import '../AdminSide/AdminTables.css';

const StaffDeliveryRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recordsSearchText, setRecordsSearchText] = useState('');
  const [recordsQuery, setRecordsQuery] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    delivery_date_time: '',
    delivery_type: '',
    complications: '',
  });

  const apiBase = '/api/delivery-records';

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiBase);
      if (!res.ok) throw new Error('Failed to fetch delivery records');
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => { (async () => { try { await loadPatients(); } catch (_) {} })(); }, []);

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

  const patientMap = useMemo(() => {
    const map = new Map();
    patients.forEach((p) => {
      const key = p.id ?? p.patient_id;
      if (key != null) map.set(key, p);
    });
    return map;
  }, [patients]);

  const filteredRecords = useMemo(() => {
    if (!recordsQuery) return records;
    const q = recordsQuery.toLowerCase();
    return records.filter((r) => {
      const p = patientMap.get(r.patient_id);
      const name = p ? getPatientDisplayName(p).toLowerCase() : '';
      const idStr = String(r.patient_id).toLowerCase();
      const type = String(r.delivery_type || '').toLowerCase();
      const dt = String(r.delivery_date_time || '').toLowerCase();
      const comps = String(r.complications || '').toLowerCase();
      return (
        name.includes(q) ||
        idStr.includes(q) ||
        type.includes(q) ||
        dt.includes(q) ||
        comps.includes(q)
      );
    });
  }, [recordsQuery, records, patientMap]);

  const toLaravelDateTime = (dt) => {
    if (!dt) return '';
    const parts = dt.replace('T', ' ').split(':');
    if (parts.length === 2) return dt.replace('T', ' ') + ':00';
    return dt.replace('T', ' ');
  };

  const addRecord = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        patient_id: Number(form.patient_id),
        delivery_date_time: toLaravelDateTime(form.delivery_date_time),
        delivery_type: form.delivery_type,
        complications: form.complications || null,
      };
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to add delivery record');
      }
      await fetchRecords();
      setForm({ patient_id: '', delivery_date_time: '', delivery_type: '', complications: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this delivery record?')) return;
    setError('');
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete record');
      await fetchRecords();
    } catch (e) {
      setError(e.message);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <StaffLayout>
      <div style={{ padding: '16px' }}>
        <h1>Delivery Records (Staff)</h1>
        {error && <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div>}

        <form onSubmit={addRecord} style={{ display: 'grid', gap: '8px', maxWidth: '520px' }}>
          <label>
            Patient
            <select
              name="patient_id"
              value={form.patient_id}
              onChange={onChange}
              required
            >
              <option value="">Select a patient...</option>
              {patients.map((p) => (
                <option key={(p.id ?? p.patient_id)} value={(p.id ?? p.patient_id)}>
                  {getPatientDisplayName(p)}
                </option>
              ))}
            </select>
            {searching && <div style={{ fontSize:12 }}>Loading patients...</div>}
          </label>
          <label>
            Delivery Date & Time
            <input
              type="datetime-local"
              name="delivery_date_time"
              value={form.delivery_date_time}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Delivery Type
            <input
              type="text"
              name="delivery_type"
              placeholder="e.g. Normal, C-section"
              value={form.delivery_type}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Complications
            <textarea
              name="complications"
              value={form.complications}
              onChange={onChange}
              placeholder="Optional details"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Add Delivery Record'}
          </button>
        </form>

        <hr style={{ margin: '16px 0' }} />

        <h2>Existing Records</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
          <input
            type="text"
            placeholder="Search by name, type, date, complications"
            value={recordsSearchText}
            onChange={(e) => setRecordsSearchText(e.target.value)}
          />
          <button type="button" onClick={() => setRecordsQuery(recordsSearchText.trim())}>Search</button>
          <button type="button" onClick={() => { setRecordsSearchText(''); setRecordsQuery(''); }}>Clear</button>
        </div>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date Time</th>
                <th>Type</th>
                <th>Complications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="5">No records found.</td>
                </tr>
              )}
              {filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td>{(() => { const p = patientMap.get(r.patient_id); return p ? getPatientDisplayName(p) : '-'; })()}</td>
                  <td>{r.delivery_date_time}</td>
                  <td>{r.delivery_type}</td>
                  <td>{r.complications || '-'}</td>
                  <td>
                    <button onClick={() => deleteRecord(r.id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDeliveryRecord;
