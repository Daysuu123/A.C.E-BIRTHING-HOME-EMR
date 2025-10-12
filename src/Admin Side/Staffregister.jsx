import React, { useState } from "react";
import "./Staffregister.css";

function Staffregister() {
  const [show, setShow] = useState(false);

  return (
    <div className="sreg-shell">
      <div className="gold-line">
        <button className="back" aria-label="Back">←</button>
      </div>

      <section className="sreg-content">
        <h1 className="title">Staff Registration</h1>

        <form className="form">
          <div className="row">
            <label className="field">
              <span>Last Name:</span>
              <input type="text" placeholder="Last Name" />
            </label>
            <label className="field">
              <span>First Name:</span>
              <input type="text" placeholder="First Name" />
            </label>
            <label className="field">
              <span>Middle Initial:</span>
              <input type="text" placeholder="M.I." />
            </label>
          </div>

          <div className="row">
            <label className="field">
              <span>Email:</span>
              <input type="email" placeholder="email@example.com" />
            </label>
            <label className="field">
              <span>Role:</span>
              <select defaultValue="Midwife">
                <option>Midwife</option>
                <option>Doctor</option>
                <option>Admin</option>
                <option>Nurse</option>
              </select>
            </label>
            <label className="field">
              <span>Phone:</span>
              <input type="tel" placeholder="09xxxxxxxxx" />
            </label>
          </div>

          <div className="row">
            <label className="field">
              <span>Password:</span>
              <input type={show ? "text" : "password"} placeholder="Password" />
            </label>
            <label className="field">
              <span>Confirm Password:</span>
              <input type={show ? "text" : "password"} placeholder="Confirm Password" />
            </label>
            <label className="show">
              <input type="checkbox" onChange={(e) => setShow(e.target.checked)} />
              Show Password
            </label>
          </div>

          <div className="actions">
            <button type="button" className="next">Register</button>
          </div>
        </form>
      </section>

      <footer className="sreg-footer">
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

export default Staffregister;

