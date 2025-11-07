import React from "react";
import { Link, useLocation } from "react-router-dom";

function StaffSidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: "/staff/landing", label: "Home", icon: "" },
    { path: "/staff/manage-patient", label: "Patients", icon: "" },
    { path: "/staff/manage-records", label: "Records", icon: "" },
    { path: "/staff/pregnancy-history", label: "Pregnancy History", icon: "" },
    { path: "/staff/newborn-information", label: "Newborn Information", icon: "" },
    { path: "/staff/delivery-record", label: "Delivery Record", icon: "" },
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
