import React from "react";
import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: "/admin/dashboard", label: "Home", icon: "" },
    { path: "/admin/patient-records", label: "Patient", icon: "" },
    { path: "/admin/manage-accounts", label: "Accounts", icon: "" },
    { path: "/admin/checkup-records", label: "Records", icon: "" },
    { path: "/admin/staff-register", label: "Staff Register", icon: "" },
    { path: "/admin/pregnancy-history", label: "Pregnancy History", icon: "" },
    { path: "/admin/delivery-record", label: "Delivery Record", icon: "" },
    { path: "/admin/newborn-information", label: "Newborn Information", icon: "" },
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

export default AdminSidebar;
