import React from "react";
import "./UserLanding.css";

function UserLanding() {
  return (
    <div className="user-shell">
      <header className="user-header">
        <div className="brand">A.C.E Birthing Home</div>
        <button className="logout">Log Out</button>
      </header>

      <div className="user-body">
        <aside className="user-sidebar">
          <div className="user-account">
            <div className="user-icon">👤</div>
            <div className="user-text">User Account</div>
          </div>
          <nav className="user-nav">
            <a className="nav-btn" href="#">Account</a>
            <a className="nav-btn active" href="#">Records</a>
            <a className="nav-btn" href="#">About</a>
            <a className="nav-btn" href="#">Feedbacks</a>
          </nav>
        </aside>

        <main className="user-content">
          <div className="packages-grid">
            <div className="package-column">
              <div className="package-card">
                <h3 className="package-title">MATERNITY PACKAGE</h3>
                <div className="service-list">
                  <div className="service-item">FIRST CHECK-UP: ₱ 250</div>
                  <div className="service-item">FOLLOW-UP CHECK-UP: ₱ 150</div>
                  <div className="service-item">OB CHECK-UP: ₱ 600</div>
                </div>
              </div>

              <div className="package-card">
                <h3 className="package-title">NEWBORN PACKAGE</h3>
                <div className="service-list">
                  <div className="service-item">NEWBORN SCREENING: ₱ 2,500</div>
                  <div className="service-item">HEARING TEST: ₱ 350</div>
                  <div className="service-item">BCG VACCINE: ₱ 500</div>
                  <div className="service-item">PENTAXIM VACCINE: ₱ 500</div>
                  <div className="service-item">BCG VACCINE: ₱ 500</div>
                  <div className="service-item">HEP B VACCINE: ₱ 350</div>
                </div>
              </div>

              <div className="package-card">
                <h3 className="package-title">FAMILY PLANNING</h3>
                <div className="service-list">
                  <div className="service-item">PILLS (COMMON): ₱ 60</div>
                  <div className="service-item">INJECTABLE (3 MONTHS): ₱ 450</div>
                  <div className="service-item">INJECTABLE (2 MONTHS): ₱ 450</div>
                  <div className="service-item">IUD & IMPLANT INSERTION: ₱ 1,500</div>
                  <div className="service-item">IUD & IMPLANT INSERTION: ₱ 1,500 - 3,000</div>
                </div>
              </div>
            </div>

            <div className="package-column">
              <div className="package-card">
                <h3 className="package-title">DOCTOR PACKAGE</h3>
                <div className="service-list">
                  <div className="service-item">DOCTOR FEE (PACKAGE): ₱ 5,000</div>
                </div>
              </div>

              <div className="package-card">
                <h3 className="package-title">MATERNITY PACKAGE WITH PHILHEALTH</h3>
                <div className="service-list">
                  <div className="service-item">MIDWIFE PROFESSIONAL: FREE</div>
                  <div className="service-item">NEWBORN SCREENING: FREE</div>
                  <div className="service-item">ROOM & BOARD WITH AIRCON: FREE</div>
                  <div className="service-item">VITAMIN K, HEP B AND BCG VACCINE: FREE</div>
                  <div className="service-item">BIRTH CERTIFICATE: FREE</div>
                </div>
              </div>

              <div className="package-card">
                <h3 className="package-title">MATERNITY PACKAGE WITH NO PHILHEALTH</h3>
                <div className="service-list">
                  <div className="service-item">MOTHER AND BABY PACKAGE ALL IN (NORMAL DELIVERY): ₱ 22,000</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="user-footer">
        <div className="footer-logo">👂</div>
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

export default UserLanding;
