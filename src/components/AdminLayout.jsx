import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children, title = "Dashboard" }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-shell">
      <header className="topbar">
        <div className="brand">
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(v => !v)}
          >☰</button>
          <div className="brand-mark">
            <img src="/vite.svg" alt="Clinic Logo" />
          </div>
          <span className="brand-name">A.C.E Birthing Home</span>
        </div>
        <div className="topbar-right">
          <span className="welcome">Welcome, Admin</span>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className={`admin-body ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className={`sidebar-wrap ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}>
          <div className="sidebar-inner" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar />
          </div>
        </div>
        
        <main className="content">
          <h1 className="dash-title">{title}</h1>
          {children}
        </main>
      </div>

      <footer className="footer">
        <div className="footer-mark">
          <img src="/vite.svg" alt="Clinic Logo" />
        </div>
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

export default AdminLayout;
