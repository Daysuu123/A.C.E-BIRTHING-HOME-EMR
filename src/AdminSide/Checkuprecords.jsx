import React, { useEffect, useState } from "react";
import "./Checkuprecords.css";
import AdminLayout from "../components/AdminLayout";
import CreateRecordsModal from "../components/CreateRecordsModal";

async function fetchRecords() {
  try {
    const res = await fetch('/api/records');
    const data = await res.json();
    if (data && data.success) {
      return (data.records || []).map((r, i) => ({
        idx: i + 1,
        name: r.patient_name,
        type: r.record_type,
        date: r.date ? new Date(r.date).toLocaleDateString('en-US') : '-',
        staff: r.attending_staff_name || String(r.attending_staff || ''),
        notes: r.notes,
        outcome: r.outcome
      }));
    }
  } catch (_) {}
  return [];
}

function Checkuprecords() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const list = await fetchRecords();
      setRows(list);
    })();
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

