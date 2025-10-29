import React from "react";
import { Link, useLocation } from "react-router-dom";

function StaffSidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: "/staff/landing", label: "Dashboard", icon: "🏠" },
    { path: "/staff/manage-patient", label: "Patients", icon: "📋" },
    { path: "/staff/manage-records", label: "Records", icon: "📊" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <nav className="nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
            to={item.path}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default StaffSidebar;
