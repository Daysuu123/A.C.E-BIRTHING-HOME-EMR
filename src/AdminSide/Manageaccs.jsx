import React from "react";
import "./Manageaccs.css";

const patientRows = [
  { email: "amieeppie10@gmail.com", name: "Amie Pangilinan Eppie", date: "08/27/2025" }
];
const staffRows = [
  { email: "obienjanelle@gmail.com", name: "Obien, Janelle C.", position: "OB-GYN", date: "01/10/2025" }
];

function Manageaccs() {
  return (
    <div className="maccs-shell">
      <div className="gold-line">
        <button className="back" aria-label="Back">←</button>
      </div>

      <section className="maccs-content">
        <h1 className="title">Manage Accounts</h1>

        <div className="table-block">
          <div className="block-title">Patient Accounts</div>
          <div className="table">
            <div className="thead">
              <div>Email</div>
              <div>Full Name</div>
              <div>Date Created</div>
              <div>Action</div>
            </div>
            {patientRows.map((r) => (
              <div className="trow" key={r.email}>
                <div className="email">{r.email}</div>
                <div className="name">{r.name}</div>
                <div className="date">{r.date}</div>
                <div className="action"><button className="edit">Edit</button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-block">
          <div className="block-title">Staff Accounts</div>
          <div className="table">
            <div className="thead">
              <div>Email</div>
              <div>Full Name</div>
              <div>Postion</div>
              <div>Date Created</div>
              <div>Action</div>
            </div>
            {staffRows.map((r) => (
              <div className="trow" key={r.email}>
                <div className="email">{r.email}</div>
                <div className="name">{r.name}</div>
                <div className="pos">{r.position}</div>
                <div className="date">{r.date}</div>
                <div className="action"><button className="edit">Edit</button></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="maccs-footer">
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

export default Manageaccs;


