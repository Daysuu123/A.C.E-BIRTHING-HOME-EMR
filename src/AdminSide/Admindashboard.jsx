import React from "react";
import "./Admindashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">{/* replace with <img src=... /> if available */}</div>
          <span className="brand-name">A.C.E Birthing Home</span>
        </div>
        <div className="topbar-right">
          <span className="welcome">Welcome, Admin</span>
          <button className="logout">Logout</button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="sidebar">
          <nav className="nav">
            <a className="nav-btn active" href="#">Home</a>
            <a className="nav-btn" href="#">Patient</a>
            <a className="nav-btn" href="#">Accounts</a>
            <a className="nav-btn" href="#">Records</a>
          </nav>
        </aside>

        <main className="content">
          <h1 className="dash-title">Dashboard</h1>
          <div className="subtitle">Patient Summary</div>

          <div className="chart-card">
            <div className="fake-chart">
              <div className="bar" style={{height: '28%'}} />
              <div className="bar" style={{height: '55%'}} />
              <div className="bar" style={{height: '18%'}} />
              <div className="bar" style={{height: '35%'}} />
              <div className="bar" style={{height: '8%'}} />
              <div className="bar" style={{height: '75%'}} />
              <div className="bar" style={{height: '3%'}} />
            </div>
            <div className="x-labels">
              <span>June 2025</span>
              <span>July 2025</span>
              <span>Aug. 2025</span>
              <span>Sept. 2025</span>
              <span>October 2025</span>
              <span>Nov. 2025</span>
              <span>Dec. 2025</span>
            </div>
          </div>
        </main>
      </div>

      <footer className="footer">
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

export default AdminDashboard;

