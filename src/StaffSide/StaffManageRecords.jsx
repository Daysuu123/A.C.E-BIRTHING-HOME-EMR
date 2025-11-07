import React, { useState, useEffect } from "react";
import "../AdminSide/Checkuprecords.css";
import StaffLayout from "../components/StaffLayout";
import StaffCreateRecordsModal from "../components/StaffCreateRecordsModal";

function StaffManageRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch checkup records from API
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/records');
      const data = await response.json();
      
      if (data.success) {
        setRecords(data.records);
        setError(null);
      } else {
        setError('Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordCreated = () => {
    // Refresh records after creating a new one
    fetchRecords();
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <StaffLayout title="Check-up and Deliver Records">
        <div className="loading-container">
          <div className="loading-spinner">Loading records...</div>
        </div>
      </StaffLayout>
    );
  }

  if (error) {
    return (
      <StaffLayout title="Check-up and Deliver Records">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={fetchRecords} className="retry-button">
            Retry
          </button>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout title="Check-up and Deliver Records">
      <div className="toolbar">
        <div>
          <div className="subtitle">Subdash</div>
          <input 
            className="search" 
            placeholder="Search: ID, Record Type, Date, Staff, Notes, Remarks" 
            style={{ marginTop: '10px' }}
          />
        </div>
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
      {records.length === 0 ? (
        <div className="no-records">
          <p>No records found. Create your first record!</p>
        </div>
      ) : (
        records.map((record, index) => (
          <div className="table-row" key={record.record_id}>
            <div>{index + 1}.</div>
            <div>{record.patient_name || 'N/A'}</div>
            <div>{record.record_type || 'N/A'}</div>
            <div>{formatDate(record.date)}</div>
            <div>{record.attending_staff_name || 'N/A'}</div>
            <div>{record.notes || 'N/A'}</div>
            <div>{record.outcome || 'N/A'}</div>
          </div>
        ))
      )}
      </div>

      <StaffCreateRecordsModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onRecordCreated={handleRecordCreated}
      />
    </StaffLayout>
  );
}

export default StaffManageRecords;
