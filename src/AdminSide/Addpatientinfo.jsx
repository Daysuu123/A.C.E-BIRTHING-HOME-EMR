import React from "react";
import "./Addpatientinfo.css";

function Addpatientinfo() {
  return (
    <div className="addpat-shell">
      <div className="gold-line">
        <button className="back" aria-label="Back">←</button>
      </div>

      <section className="addpat-content">
        <h1 className="title">Patient Personal Information</h1>

        <form className="addpat-form">
          {/* Personal Details Section */}
          <div className="form-section">
            <div className="row">
              <label className="field">
                <span>Last Name (Maiden's):</span>
                <input type="text" defaultValue="Eppie" />
              </label>
              <label className="field">
                <span>First Name:</span>
                <input type="text" defaultValue="Amie" />
              </label>
              <label className="field">
                <span>Middle Name:</span>
                <input type="text" defaultValue="Pangilinan" />
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Date of Birth:</span>
                <input type="text" defaultValue="(08/10/2004)" />
              </label>
              <label className="field">
                <span>Age:</span>
                <input type="text" defaultValue="21" />
              </label>
              <div className="field radio-group">
                <span>Marital Status:</span>
                <div className="radio-options">
                  <label><input type="radio" name="marital" defaultChecked /> Single</label>
                  <label><input type="radio" name="marital" /> Married</label>
                  <label><input type="radio" name="marital" /> Widowed</label>
                  <label><input type="radio" name="marital" /> Divorced</label>
                </div>
              </div>
            </div>

            <div className="row">
              <label className="field wide">
                <span>Address:</span>
                <input type="text" defaultValue="Phs. 2 Pkg. 2 Blk. 36 Lot. 6 Bagong Silang" />
              </label>
              <label className="field">
                <span>Place of Birth:</span>
                <input type="text" defaultValue="Caloocan City" />
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Province:</span>
                <select defaultValue="Nueva Ecijah">
                  <option>Nueva Ecijah</option>
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
            </div>

            <div className="row">
              <label className="field">
                <span>Nationality:</span>
                <input type="text" defaultValue="Filipino" />
              </label>
              <label className="field">
                <span>Religion:</span>
                <input type="text" defaultValue="Roman Catholic" />
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09666741206" />
              </label>
              <label className="field">
                <span>Emergency Contact:</span>
                <input type="text" defaultValue="09077041896" />
              </label>
            </div>

            <div className="row">
              <label className="field">
                <span>Social Security#:</span>
                <input type="text" />
              </label>
              <label className="field">
                <span>Philhealth#:</span>
                <input type="text" />
              </label>
            </div>
          </div>

          {/* Father's Information Section */}
          <div className="form-section">
            <h3 className="section-title">Father's Information</h3>
            <div className="row">
              <label className="field">
                <span>Father's Name:</span>
                <input type="text" defaultValue="Rues L. Eppie" />
              </label>
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09195550888" />
              </label>
            </div>
            <div className="row">
              <label className="field">
                <span>Occupation:</span>
                <input type="text" defaultValue="Computer Technician" />
              </label>
              <label className="field">
                <span>Father's Address:</span>
                <input type="text" defaultValue="Phs. 2 Pkg. 2 Blk. 36 Lot. 6 Bagong Silang" />
              </label>
            </div>
          </div>

          {/* Mother's Information Section */}
          <div className="form-section">
            <h3 className="section-title">Mother's Information</h3>
            <div className="row">
              <label className="field">
                <span>Mother's Name:</span>
                <input type="text" defaultValue="Josephine P. Eppie" />
              </label>
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09285552470" />
              </label>
            </div>
            <div className="row">
              <label className="field">
                <span>Occupation:</span>
                <input type="text" defaultValue="Housewife" />
              </label>
              <label className="field">
                <span>Mother's Address:</span>
                <input type="text" defaultValue="Phs. 2 Pkg. 2 Blk. 36 Lot. 6 Bagong Silang" />
              </label>
            </div>
          </div>

          {/* Spouse Information Section */}
          <div className="form-section">
            <h3 className="section-title">Spouse Information</h3>
            <div className="row">
              <label className="field">
                <span>Spouse:</span>
                <input type="text" defaultValue="Dace E. Crossfield" />
              </label>
              <label className="field">
                <span>Contact:</span>
                <input type="text" defaultValue="09235552407" />
              </label>
            </div>
            <div className="row">
              <label className="field">
                <span>Occupation:</span>
                <input type="text" defaultValue="Web Developer" />
              </label>
            </div>
          </div>

          <div className="actions">
            <button type="button" className="register">Register</button>
          </div>
        </form>
      </section>

      <footer className="addpat-footer">
        <div className="footer-mark" />
        <div className="mission">
          TO PROVIDE EXCEPTIONAL
          <br />
          MIDWIFERY CARE TO EACH AND
          <br />
          EVERY WOMAN
        </div>
      </footer>
    </div>
  );
}

export default Addpatientinfo;
