import React from "react";
import "../AdminSide/Manageaccs.css";
import StaffLayout from "../components/StaffLayout";

const patientRows = [
  { email: "amieeppie10@gmail.com", name: "Amie Pangilinan Eppie", date: "08/27/2025" },
  { email: "candice.galilea@example.com", name: "Candice Galilea", date: "07/14/2025" },
  { email: "kaylie.celia@example.com", name: "Kaylie Celia", date: "06/02/2025" }
];
const staffRows = [
  { email: "obienjanelle@gmail.com", name: "Obien, Janelle C.", position: "OB-GYN", date: "01/10/2025" },
  { email: "la.anne@example.com", name: "Anne, L.", position: "Midwife", date: "02/05/2025" },
  { email: "l.cruz@example.com", name: "Cruz, L.", position: "Pediatrician", date: "03/22/2025" }
];

function StaffManageAccounts() {
  return (
    <StaffLayout title="Manage Accounts">
      <div className="table-block">
        <div className="block-title">Patient Accounts</div>
        <div className="table patient">
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
        <div className="table staff">
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
    </StaffLayout>
  );
}

export default StaffManageAccounts;


