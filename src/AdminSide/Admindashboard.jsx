import React from "react";
import "./Admindashboard.css";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
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
    </AdminLayout>
  );
}

export default AdminDashboard;

