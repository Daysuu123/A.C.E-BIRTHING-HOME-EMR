import React from "react";
import "./Checkuprecords.css";

const rows = [
  { idx: 1, name: "Eppie, Amie P.", type: "Prenatal", date: "09/18/2025", staff: "Dr. Selby Love", notes: "High Bp Detected", outcome: "Continue Monitoring" }
];

function Checkuprecords() {
  return (
    <div className="curec-shell">
      <div className="breadcrumbs">Check-up Records (Admin)</div>
      <div className="gold-line">
        <button className="back" aria-label="Back">←</button>
      </div>

      <section className="curec-content">
        <h1 className="title">Check-up and Deliver Records</h1>
        <div className="subtitle">Subdash</div>

        <input className="search" placeholder="Search: ID, Record Type, Date, Staff, Notes, Remarks" />

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
          {rows.map((r) => (
            <div className="table-row" key={r.idx}>
              <div>{r.idx}.</div>
              <div>{r.name}</div>
              <div>{r.type}</div>
              <div>{r.date}</div>
              <div>{r.staff}</div>
              <div>{r.notes}</div>
              <div>{r.outcome}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="curec-footer">
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

export default Checkuprecords;

