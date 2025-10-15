import React from "react";
import { useNavigate } from "react-router-dom";
import "./Stafflanding.css";

function StaffLanding() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Navigate back to login page
    navigate('/');
  };

  return (
    <div className="staff-shell">
      <header className="staff-header">
        <div className="header-top">
          <span className="page-title">Staff Landing Page</span>
        </div>
        <div className="header-main">
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-circle">
                <div className="logo-icon">👤❤️</div>
              </div>
              <span className="brand-text">A.C.E BIRTHING HOME</span>
            </div>
            <h1 className="brand-name">A.C.E Birthing Home</h1>
          </div>
          <div className="header-right">
            <span className="welcome-text">Welcome, Staff</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="header-divider"></div>
      </header>

      <div className="staff-body">
        <aside className="staff-sidebar">
          <nav className="staff-nav">
            <button 
              className="nav-btn active" 
              onClick={() => handleNavigation('/staff/dashboard')}
            >
              Home
            </button>
            <button 
              className="nav-btn" 
              onClick={() => handleNavigation('/staff/manage-patient')}
            >
              Manage Patient
            </button>
            <button 
              className="nav-btn" 
              onClick={() => handleNavigation('/staff/add-patient')}
            >
              Add Patient
            </button>
            <button 
              className="nav-btn" 
              onClick={() => handleNavigation('/staff/create-records')}
            >
              Create Records
            </button>
            <button 
              className="nav-btn" 
              onClick={() => handleNavigation('/staff/manage-records')}
            >
              Manage Records
            </button>
          </nav>
        </aside>

        <main className="staff-content">
          <div className="content-illustration">
            <div className="mother-baby-illustration">
              <div className="mother-figure">
                <div className="mother-head">👩</div>
                <div className="mother-body">🤱</div>
              </div>
              <div className="baby-figure">
                <div className="baby-head">👶</div>
                <div className="baby-bow">🎀</div>
              </div>
            </div>
          </div>
          <div className="mission-text">
            TO PROVIDE EXCEPTIONAL
            <br />
            MIDWIFERY CARE TO EACH AND
            <br />
            EVERY WOMAN
          </div>
        </main>
      </div>

      <footer className="staff-footer">
        <div className="footer-bar"></div>
      </footer>
    </div>
  );
}

export default StaffLanding;
