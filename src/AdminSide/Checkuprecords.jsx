import React, { useEffect, useState } from "react";
import "./Checkuprecords.css";
import AdminLayout from "../components/AdminLayout";
import CreateRecordsModal from "../components/CreateRecordsModal";

// Helper function to convert API data into a standardized row format
async function fetchRecords() {
  try {
    const res = await fetch('/api/records');
    const data = await res.json();
    if (data && data.success) {
      return (data.records || []).map((r, i) => ({
        idx: i + 1,
        name: r.patient_name,
        type: r.record_type,
        // Format date for display
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
  // 1. Store the complete list of records fetched from the API
  const [allRecords, setAllRecords] = useState([]); 
  // 2. Store the current search term
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    // Function to load data and store it in allRecords
    const loadRecords = async () => {
      const list = await fetchRecords();
      setAllRecords(list);
    };
    loadRecords();
    
    // We refresh data whenever the modal is closed (showCreateModal changes)
  }, [showCreateModal]);

  // 3. Filter the records based on the search term
  const filteredRows = allRecords.filter(record => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true; // Show all records if search term is empty

    // Concatenate all searchable fields into a single string for efficient searching
    const searchableText = `
      ${record.idx} 
      ${record.name} 
      ${record.type} 
      ${record.date} 
      ${record.staff} 
      ${record.notes} 
      ${record.outcome}
    `.toLowerCase();

    return searchableText.includes(term);
  });


  return (
    <AdminLayout title="Check-up and Deliver Records">
      <div className="toolbar">
        {/* 4. Attach onChange handler and value to the search input */}
        <input 
          className="search" 
          placeholder="Search: ID, Record Type, Date, Staff, Notes, Remarks" 
          style={{ marginTop: '0' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
        {/* 5. Map over the filteredRows array instead of the original 'rows' */}
        {filteredRows.map((r) => (
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