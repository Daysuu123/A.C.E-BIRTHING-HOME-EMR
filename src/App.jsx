import React from "react";
 HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loginpage from "./Admin/loginpage";
import Admindashboard from "./Admin/Admindashboard";
import Checkuprecords from "./Admin/Checkuprecords";
import Createrecords from "./Admin/Createrecords";
import Manageaccs from "./Admin/Manageaccs";
import Patientrecords from "./Admin/Patientrecords";
import Patientregister from "./Admin/Patientregister";
import Staffregister from "./Admin/Staffregister";

function isAdminAuthenticated() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return false;
    const auth = JSON.parse(raw);
    return auth && auth.role === "admin";
  } catch (_) {
    return false;
  }
}

function ProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginpage from "./AdminSide/loginpage";
import Admindashboard from "./AdminSide/Admindashboard";
import Checkuprecords from "./AdminSide/Checkuprecords";
import Createrecords from "./AdminSide/Createrecords";
import Manageaccs from "./AdminSide/Manageaccs";
import Patientrecords from "./AdminSide/Patientrecords";
import Patientregister from "./AdminSide/Patientregister";
import Staffregister from "./AdminSide/Staffregister";
b41a8c41ecd1f40e7a5c60c7f517818ca1bcd1b

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Admindashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/checkup-records"
          element={
            <ProtectedRoute>
              <Checkuprecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-records"
          element={
            <ProtectedRoute>
              <Createrecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-accounts"
          element={
            <ProtectedRoute>
              <Manageaccs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patient-records"
          element={
            <ProtectedRoute>
              <Patientrecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patient-register"
          element={
            <ProtectedRoute>
              <Patientregister />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff-register"
          element={
            <ProtectedRoute>
              <Staffregister />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
=======
        <Route path="/admin/dashboard" element={<Admindashboard />} />
        <Route path="/admin/checkup-records" element={<Checkuprecords />} />
        <Route path="/admin/create-records" element={<Createrecords />} />
        <Route path="/admin/manage-accounts" element={<Manageaccs />} />
        <Route path="/admin/patient-records" element={<Patientrecords />} />
        <Route path="/admin/patient-register" element={<Patientregister />} />
        <Route path="/admin/staff-register" element={<Staffregister />} />
>>>>>>> 3b41a8c41ecd1f40e7a5c60c7f517818ca1bcd1b
      </Routes>
    </Router>
  );
}

export default App;