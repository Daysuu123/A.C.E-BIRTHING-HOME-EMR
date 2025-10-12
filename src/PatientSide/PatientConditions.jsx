import React from "react";
import "./PatientConditions.css";

function PatientConditions() {
  return (
    <div className="pc-shell">
      <div className="page-header">
        <h1 className="page-title">Conditions</h1>
      </div>

      <div className="pc-body">
        <aside className="pc-sidebar">
          <div className="user-account">
            <div className="user-icon">👤</div>
            <div className="user-text">User Account</div>
          </div>
          
          <nav className="pc-nav">
            <a className="nav-btn" href="#">Account</a>
            <a className="nav-btn" href="#">Home</a>
            <a className="nav-btn" href="#">About</a>
            <a className="nav-btn" href="#">Feedback</a>
          </nav>
        </aside>

        <main className="pc-content">
          <div className="content-header">
            <div className="brand-icon">🛡️</div>
            <div className="brand-name">A.C.E Birthing Home</div>
          </div>

          <div className="form-container">
            <h2 className="main-title">Patient's Medical Records</h2>

            {/* Patient's Medical Records Section */}
            <div className="form-section">
              <h3 className="section-title">Patient's Medical Records</h3>
              
              <div className="field-group">
                <label className="field-label">Chronic Illnesses (if any):</label>
                <input type="text" className="field-input full-width" placeholder="Enter any chronic illnesses" />
              </div>

              <div className="field-group">
                <label className="field-label">Allergies:</label>
                <input type="text" className="field-input full-width" placeholder="Enter any allergies" />
              </div>

              <div className="field-group">
                <label className="field-label">Medications Currently Taken:</label>
                <input type="text" className="field-input full-width" placeholder="Enter current medications" />
              </div>
            </div>

            {/* Delivery Records Section */}
            <div className="form-section">
              <h3 className="section-title">Delivery Records</h3>
              
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Date of Delivery:</label>
                  <input type="date" className="field-input" />
                </div>
                <div className="field-group">
                  <label className="field-label">Mode of delivery:</label>
                  <select className="field-input">
                    <option value="">Select mode</option>
                    <option value="normal">Normal Delivery</option>
                    <option value="cesarean">Cesarean Section</option>
                    <option value="assisted">Assisted Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Newborn's Information Section */}
            <div className="form-section">
              <h3 className="section-title">Newborn's Information</h3>
              
              <div className="field-group">
                <label className="field-label">Baby's Full Name:</label>
                <input type="text" className="field-input full-width" placeholder="Enter baby's full name" />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Weight:</label>
                  <input type="text" className="field-input" placeholder="Weight (kg)" />
                </div>
                <div className="field-group">
                  <label className="field-label">Sex:</label>
                  <select className="field-input">
                    <option value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Baby's Head Circumference:</label>
                  <input type="text" className="field-input" placeholder="Head circumference (cm)" />
                </div>
                <div className="field-group">
                  <label className="field-label">Date of Birth:</label>
                  <input type="date" className="field-input" />
                </div>
                <div className="field-group">
                  <label className="field-label">Time of Birth:</label>
                  <input type="time" className="field-input" />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Place of Birth:</label>
                <input type="text" className="field-input full-width" placeholder="Enter place of birth" />
              </div>

              <div className="field-group">
                <label className="field-label">Attending Midwife/Physician:</label>
                <input type="text" className="field-input full-width" placeholder="Enter attending medical professional" />
              </div>
            </div>

            <div className="note">
              Note: This is a Doc (1) Ume Form. Contact the clinic for updating your information.
            </div>

            <div className="actions">
              <button type="button" className="done-btn">Done</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientConditions;
