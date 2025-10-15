import React from "react";
import "./Createrecords.css";
import { Link } from "react-router-dom";

function Createrecords() {
  return (
    <div className="cr-shell">
      <div className="gold-line">
        <Link className="back" aria-label="Back" to="/admin/dashboard">←</Link>
      </div>

      <section className="cr-content">
        <h1 className="title">Create Check-up and Deliver Records</h1>

        <form className="cr-form">
          <label className="field wide">
            <span>Patient Name:</span>
            <input type="text" defaultValue="Eppie, Amie P." />
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
              <input type="date" defaultValue="2025-09-18" />
            </label>

            <label className="field">
              <span>Attending Staff</span>
              <select defaultValue="Dr. Selby Loren">
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
              <button type="button" className="create">Create</button>
            </div>
          </div>
        </form>
      </section>

      <footer className="cr-footer">
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

export default Createrecords;


