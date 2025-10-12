import React from "react";
import "./PatientPersonalInfo.css";

function PatientPersonalInfo() {
  return (
    <div className="ppi-shell">
      <aside className="ppi-sidebar">
        <h2 className="sidebar-title">Personal Info</h2>
        
        <div className="user-account">
          <div className="user-icon">👤</div>
          <div className="user-text">User Account</div>
        </div>
        
        <nav className="ppi-nav">
          <a className="nav-btn active" href="#">Account</a>
          <a className="nav-btn" href="#">Home</a>
          <a className="nav-btn" href="#">About</a>
          <a className="nav-btn" href="#">Feedbacks</a>
        </nav>
      </aside>

      <main className="ppi-content">
        <div className="content-header">
          <div className="brand-icon">🛡️</div>
          <div className="brand-name">A.C.E Birthing Home</div>
        </div>

        <div className="form-container">
          {/* Personal Profile Section */}
          <div className="form-section">
            <h2 className="section-title">Personal Profile</h2>
            
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <div className="name-fields">
                <input type="text" placeholder="First Name" className="name-input" />
                <input type="text" placeholder="Middle Name" className="name-input" />
                <input type="text" placeholder="Last Name" className="name-input" />
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Date of Birth</label>
                <input type="date" className="field-input" />
              </div>
              <div className="field-group">
                <label className="field-label">Age</label>
                <input type="text" placeholder="Age" className="field-input age-input" />
              </div>
              <div className="field-group">
                <label className="field-label">Patient's Contact Information</label>
                <input type="text" placeholder="Contact Information" className="field-input contact-input" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Contact in case of emergency:</label>
              <input type="text" placeholder="Emergency Contact" className="field-input emergency-input" />
            </div>
          </div>

          {/* Pregnancy History Section */}
          <div className="form-section">
            <h2 className="section-title">Pregnancy History</h2>
            
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Estimated Due Date (EDD)</label>
                <input type="date" className="field-input" />
              </div>
              <div className="field-group">
                <label className="field-label">Last Menstrual Period (LMP)</label>
                <input type="date" className="field-input" />
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Blood Type</label>
                <select className="field-input">
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Weight</label>
                <input type="text" placeholder="Weight (kg)" className="field-input" />
              </div>
              <div className="field-group">
                <label className="field-label">Height</label>
                <input type="text" placeholder="Height (cm)" className="field-input" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Pregnancy Concerns:</label>
              <textarea placeholder="Any concerns or special notes about your pregnancy" className="field-input concerns-input" rows="3"></textarea>
            </div>
          </div>

          <div className="note">
            Note: This is a one (1) time form. Contact the clinic for updating your information.
          </div>

          <div className="actions">
            <button type="button" className="next-btn">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientPersonalInfo;
