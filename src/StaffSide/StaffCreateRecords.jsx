import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../components/StaffLayout";
// Note: Add your CSS import here once you find the correct path
// Examples: import "./StaffCreateRecords.css"; or import "../AdminSide/Createrecords.css";

function StaffCreateRecords() {
  const navigate = useNavigate();
  
  // Mock female patient names for dropdown
  const femalePatients = [
    "Eppie, Amie P.",
    "Santos, Maria L.",
    "Reyes, Sofia G.",
    "Cruz, Isabella M.",
    "Garcia, Gabriela T.",
    "Lim, Jasmine R.",
    "Tan, Angela D.",
    "Mendoza, Camille P.",
    "Fernandez, Diana L.",
    "Ramos, Victoria S."
  ];

  // State to control what to show: 'calendar' or 'form'
  const [view, setView] = useState('calendar');
  
  // State to hold the selected date
  const [selectedDate, setSelectedDate] = useState("");
  
  // State to track record counts per date
  const [recordCounts, setRecordCounts] = useState({});
  
  // State for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Load record counts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recordCounts');
    if (stored) {
      setRecordCounts(JSON.parse(stored));
    }
  }, []);
  
  // Generate calendar days
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    if (!date) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow past dates
    if (date < today) {
      alert('Cannot select past dates.');
      return;
    }
    
    const selectedDateStr = date.toISOString().split('T')[0];
    
    // Check if the selected date has reached the limit of 10 check-ups
    if (recordCounts[selectedDateStr] >= 10) {
      alert('Closed: Maximum 10 check-ups per day reached for this date.');
      return;
    }
    
    setSelectedDate(selectedDateStr);
    setView('form');
  };
  
  // Handle final submission
  const handleSubmit = () => {
    // Collect form data
    const formData = {
      patientName: document.querySelector('select').value,
      recordType: document.querySelectorAll('select')[1].value,
      date: selectedDate,
      attendingStaff: document.querySelectorAll('select')[2].value,
      notes: document.querySelector('input[type="text"]').value,
      outcome: document.querySelector('textarea').value
    };
    
    // Update record count for the selected date
    const newCounts = { ...recordCounts };
    newCounts[selectedDate] = (newCounts[selectedDate] || 0) + 1;
    setRecordCounts(newCounts);
    
    // Persist to localStorage
    localStorage.setItem('recordCounts', JSON.stringify(newCounts));
    
    // You can also save the form data if needed
    console.log('Record created:', formData);
    
    // Proceed to create the record (navigate to manage records)
    navigate("/staff/manage-records", { replace: true });
  };
  
  // Handle cancel button - go back to calendar
  const handleCancel = () => {
    setView('calendar');
    setSelectedDate("");
  };
  
  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const calendarDays = generateCalendar();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    <StaffLayout title="Create Check-up and Deliver Records">
      {view === 'calendar' ? (
        // Calendar View - shown first
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '500px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '40px'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '20px' }}>
              Select a Date for the Record
            </h2>
            
            {/* Calendar Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <button 
                onClick={previousMonth}
                type="button"
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ‹
              </button>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button 
                onClick={nextMonth}
                type="button"
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ›
              </button>
            </div>
            
            {/* Day Names */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '5px',
              marginBottom: '10px'
            }}>
              {dayNames.map(day => (
                <div key={day} style={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  padding: '8px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '5px'
            }}>
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={index} />;
                }
                
                const dateStr = date.toISOString().split('T')[0];
                const count = recordCounts[dateStr] || 0;
                const isPast = date < today;
                const isFull = count >= 10;
                const isDisabled = isPast || isFull;
                
                return (
                  <div
                    key={index}
                    onClick={() => !isDisabled && handleDateSelect(date)}
                    style={{
                      padding: '10px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      backgroundColor: isDisabled ? '#f0f0f0' : 'white',
                      opacity: isPast ? 0.4 : 1,
                      position: 'relative',
                      minHeight: '50px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled) {
                        e.currentTarget.style.backgroundColor = '#e8f5e9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDisabled) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>
                      {date.getDate()}
                    </div>
                    {count > 0 && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: isFull ? 'red' : 'green',
                        fontWeight: 'bold',
                        marginTop: '2px'
                      }}>
                        {count}/10
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p style={{ 
              marginTop: '20px', 
              fontSize: '12px', 
              color: '#666', 
              textAlign: 'center' 
            }}>
              * Green numbers show current bookings. Red dates are fully booked (10/10).
            </p>
          </div>
        </div>
      ) : (
        // Form View - shown after date selection
        <form className="cr-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field wide">
            <span>Patient Name:</span>
            <select defaultValue="Eppie, Amie P.">
              {femalePatients.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <div className="row">
            <label className="field">
              <span>Record Type:</span>
              <select defaultValue="Prenatal">
                <option>Prenatal</option>
                <option>Postnatal</option>
                <option>Delivery</option>
              </select>
            </label>

            <label className="field">
              <span>Date:</span>
              <input 
                type="date" 
                value={selectedDate} 
                readOnly 
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
              />
            </label>

            <label className="field">
              <span>Attending Staff</span>
              <select defaultValue="Midwife L. Anne">
                <option>Dr. Selby Loren</option>
                <option>Midwife L. Anne</option>
                <option>Dr. L. Cruz</option>
              </select>
            </label>
          </div>

          <label className="field wide">
            <span>Notes</span>
            <input type="text" defaultValue="High Bp detected" />
          </label>

          <div className="row">
            <label className="field wide">
              <span>Outcome</span>
              <textarea rows={3} defaultValue="Continue Monitoring" />
            </label>

            <div className="actions">
              <button
                type="button"
                className="cancel"
                onClick={handleCancel}
                style={{ marginRight: '10px' }}
              >
                Back to Calendar
              </button>
              <button
                type="button"
                className="create"
                onClick={handleSubmit}
              >
                Submit Record
              </button>
            </div>
          </div>
        </form>
      )}
    </StaffLayout>
  );
}

export default StaffCreateRecords;