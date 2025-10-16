import React, { useState } from "react";
import "./Patientregister.css";
import { Link, useNavigate } from "react-router-dom";

function Patientregister() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/admin/add-patient-info');
  };

  return (
    <div className="preg-shell">
      <div className="preg-head">
        <div className="gold-line">
          <Link className="back" aria-label="Back" to="/admin/dashboard">←</Link>
        </div>
      </div>

      <section className="preg-content">
        <h1 className="title">Patient Registration</h1>

        <form className="form">
          <div className="row">
            <label className="field">
              <span>Last Name:</span>
              <input type="text" defaultValue="Eppie" />
            </label>
            <label className="field">
              <span>First Name:</span>
              <input type="text" defaultValue="Amie" />
            </label>
            <label className="field">
              <span>Middle Initial:</span>
              <input type="text" defaultValue="Pangilinan" />
            </label>
          </div>

          <div className="row">
            <label className="field wide">
              <span>Email:</span>
              <input type="email" defaultValue="amieeppie10@gmail.com" />
            </label>
          </div>

          <div className="row">
            <label className="field">
              <span>Password:</span>
              <input type={show ? "text" : "password"} defaultValue="Amie@2313" />
            </label>
            <label className="field">
              <span>Confirm Password:</span>
              <input type={show ? "text" : "password"} defaultValue="Amie@2313" />
            </label>
            <label className="show">
              <input type="checkbox" onChange={(e) => setShow(e.target.checked)} />
              Show Password
            </label>
          </div>

          <div className="actions">
            <button type="button" className="next" onClick={handleNext}>Next</button>
          </div>
        </form>
      </section>

      <footer className="preg-footer">
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

export default Patientregister;


