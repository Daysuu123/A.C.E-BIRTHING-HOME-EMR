import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// AdminSide pages
import Loginpage from "./AdminSide/loginpage";
import Admindashboard from "./AdminSide/Admindashboard";
import Checkuprecords from "./AdminSide/Checkuprecords";
import Createrecords from "./AdminSide/Createrecords";
import Manageaccs from "./AdminSide/Manageaccs";
import Patientrecords from "./AdminSide/Patientrecords";
import Patientregister from "./AdminSide/Patientregister";
import Staffregister from "./AdminSide/Staffregister";
import Addpatientinfo from "./AdminSide/Addpatientinfo";

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
        <Route
          path="/admin/add-patient-info"
          element={
            <ProtectedRoute>
              <Addpatientinfo />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;