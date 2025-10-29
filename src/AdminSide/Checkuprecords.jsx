import React, { useEffect, useState } from "react";
import "./Checkuprecords.css";
import AdminLayout from "../components/AdminLayout";
import CreateRecordsModal from "../components/CreateRecordsModal";

function readRecords() {
  try {
    const raw = localStorage.getItem('checkup_records');
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) { return []; }
}

function Checkuprecords() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const base = [
      { idx: 1, name: "Eppie, Amie P.", type: "Prenatal", date: "09/18/2025", staff: "Dr. Selby Love", notes: "High Bp Detected", outcome: "Continue Monitoring" }
    ];
    const saved = readRecords();
    const merged = [...base, ...saved.map((r, i) => ({ idx: 2 + i, ...r }))];
    setRows(merged);
  }, [showCreateModal]);

  return (
    <AdminLayout title="Check-up and Deliver Records">
      <div className="toolbar">
        <input 
          className="search" 
          placeholder="Search: ID, Record Type, Date, Staff, Notes, Remarks" 
          style={{ marginTop: '0' }}
        />
        <button 
          className="action-btn"
          onClick={() => setShowCreateModal(true)}
        >
          Create a Record
        </button>
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div>#</div>
          <div>Name</div>
          <div>Record Type</div>
          <div>Date</div>
          <div>Attending Staff</div>
          <div>Notes</div>
          <div>Outcome</div>
        </div>
        {rows.map((r) => (
          <div className="table-row" key={r.idx}>
            <div>{r.idx}.</div>
            <div>{r.name}</div>
            <div>{r.type}</div>
            <div>{r.date}</div>
            <div>{r.staff}</div>
            <div>{r.notes}</div>
            <div>{r.outcome}</div>
          </div>
        ))}
      </div>

      <CreateRecordsModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </AdminLayout>
  );
}

export default Checkuprecords;

