import React from "react";
import "./PatientProfilePage.css";

function PatientProfilePage() {
  return (
    <div className="pppage-shell">
      <div className="top-header">
        <div className="brand-name">A.C.E Birthing Home</div>
        <div className="page-title">PROFILE PAGE</div>
      </div>
      <div className="sub-header">
        <div className="patient-id">D-10001</div>
        <div className="patient-name">Dela Cruz, Mary A.</div>
      </div>

      <section className="pppage-content">
        <div className="gold-line">
          <button className="back" aria-label="Back">←</button>
        </div>

        <h1 className="title">Patient Personal Information</h1>

        <form className="pppage-form">
          {/* Personal Details Section */}
          <div className="form-section">
            <h2 className="section-title">Personal Details</h2>
            <div className="row">
              <label className="field">
                <span>Last Name (Maiden's):</span>
                <input type="text" defaultValue="Dela Cruz" />
              </label>
              <label className="field">
                <span>First Name:</span>
                <input type="text" defaultValue="Mary" />
              </label>
              <label className="field">
                <span>Middle Initial:</span>
                <input type="text" defaultValue="A" />
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Date of Birth:</span>
                <input type="text" defaultValue="(30/10/2004)" />
              </label>
              <label className="field">
                <span>Age:</span>
                <input type="text" defaultValue="21" />
              </label>
              <div className="field marital-status">
                <span>Marital Status:</span>
                <div className="radio-group">
                  <label><input type="radio" name="maritalStatus" value="single" /> Single</label>
                  <label><input type="radio" name="maritalStatus" value="married" defaultChecked /> Married</label>
                  <label><input type="radio" name="maritalStatus" value="widowed" /> Widowed</label>
                  <label><input type="radio" name="maritalStatus" value="divorced" /> Divorced</label>
                </div>
              </div>
            </div>

            <div className="row">
              <label className="field wide">
                <span>Address:</span>
                <input type="text" defaultValue="Phs. 2 Pkg. 2 Blk. 36 Lot. 6 Bagong Silang" />
              </label>
              <label className="field">
                <span>Religion:</span>
                <input type="text" defaultValue="Roman Catholic" />
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Province:</span>
                <select defaultValue="Nueva Ecija">
                  <option>Nueva Ecija</option>
                  <option>Metro Manila</option>
                  <option>Bulacan</option>
                </select>
              </label>
              <label className="field">
                <span>Town/City:</span>
                <select defaultValue="Caloocan City">
                  <option>Caloocan City</option>
                  <option>Quezon City</option>
                  <option>Manila</option>
                </select>
              </label>
              <label className="field">
                <span>Nationality:</span>
                <input type="text" defaultValue="Filipino" />
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09666741206" />
              </label>
              <label className="field">
                <span>Emergency Contact:</span>
                <input type="text" defaultValue="09077041806" />
              </label>
              <div className="field"></div>
            </div>

            <div className="row">
              <label className="field">
                <span>Social Security #:</span>
                <input type="text" />
              </label>
              <label className="field">
                <span>PhilHealth #:</span>
                <input type="text" />
              </label>
              <div className="field"></div>
            </div>
          </div>

          {/* Father's Information Section */}
          <div className="form-section">
            <h2 className="section-title">Father's Information</h2>
            <div className="row">
              <label className="field">
                <span>Father's Name:</span>
                <input type="text" defaultValue="Rues L. Eppie" />
              </label>
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09196550888" />
              </label>
              <label className="field">
                <span>Occupation:</span>
                <input type="text" defaultValue="Computer Technician" />
              </label>
            </div>
            <div className="row">
              <label className="field wide">
                <span>Father's Address:</span>
                <input type="text" defaultValue="Phs. 2 Pkg. 2 Blk. 36 Lot. 6 Bagong Silang" />
              </label>
            </div>
          </div>

          {/* Mother's Information Section */}
          <div className="form-section">
            <h2 className="section-title">Mother's Information</h2>
            <div className="row">
              <label className="field">
                <span>Mother's Name:</span>
                <input type="text" defaultValue="Josephine P. Eppie" />
              </label>
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09285552470" />
              </label>
              <label className="field">
                <span>Occupation:</span>
                <input type="text" defaultValue="Housewife" />
              </label>
            </div>
            <div className="row">
              <label className="field wide">
                <span>Mother's Address:</span>
                <input type="text" defaultValue="Phs. 2 Pkg. 2 Blk. 36 Lot. 6 Bagong Silang" />
              </label>
            </div>
          </div>

          {/* Spouse Information Section */}
          <div className="form-section">
            <h2 className="section-title">Spouse Information</h2>
            <div className="row">
              <label className="field">
                <span>Spouse:</span>
                <input type="text" defaultValue="Gace B. Crossfield" />
              </label>
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09035552407" />
              </label>
              <label className="field">
                <span>Occupation:</span>
                <input type="text" defaultValue="Web Developer" />
              </label>
            </div>
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-logo">
            A.C.E
            <span className="footer-sub">Birthing Home</span>
          </div>
        </div>
        <p className="footer-mission">
          TO PROVIDE EXCEPTIONAL
          <br />
          MIDWIFERY CARE TO EACH AND
          <br />
          EVERY WOMAN
        </p>
      </footer>
    </div>
  );
}

export default PatientProfilePage;
