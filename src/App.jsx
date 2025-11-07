import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// AdminSide pages
import Loginpage from "./AdminSide/loginpage";
import ForgotPassword from "./AdminSide/ForgotPassword";
import ChangePassword from "./AdminSide/ChangePassword";
import Admindashboard from "./AdminSide/Admindashboard";
import Checkuprecords from "./AdminSide/Checkuprecords";
import Createrecords from "./AdminSide/Createrecords";
import Manageaccs from "./AdminSide/Manageaccs";
import Patientrecords from "./AdminSide/Patientrecords";  
import Patientregister from "./AdminSide/Patientregister";
import Addpatientinfo from "./AdminSide/Addpatientinfo";
import AddpatientinfoModal from "./AdminSide/AddpatientinfoModal";
import Staffregister from "./AdminSide/Staffregister";
import Editpatientinfo from "./AdminSide/Editpatientinfo";
import Editpatientaccount from "./AdminSide/Editpatientaccount";
import Editstaffaccount from "./AdminSide/Editstaffaccount";
import Stafflanding from "./StaffSide/Stafflanding";
import StaffManagePatient from "./StaffSide/StaffManagePatient";
import StaffCreateRecords from "./StaffSide/StaffCreateRecords";
import StaffManageRecords from "./StaffSide/StaffManageRecords";
import StaffAddPatient from "./StaffSide/StaffAddPatient";
import StaffManageAccounts from "./StaffSide/StaffManageAccounts";
import UserLanding from "./PatientSide/UserLanding";
import PregnancyHistory from "./AdminSide/PregnancyHistory";
import DeliveryRecord from "./AdminSide/DeliveryRecord";
import NewbornInformation from "./AdminSide/NewbornInformation";
import StaffPregnancyHistory from "./StaffSide/StaffPregnancyHistory";
import StaffNewbornInformation from "./StaffSide/StaffNewbornInformation";
import StaffDeliveryRecord from "./StaffSide/StaffDeliveryRecord";

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

function isStaffAuthenticated() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return false;
    const auth = JSON.parse(raw);
    return auth && auth.role === "staff";
  } catch (_) {
    return false;
  }
}

function StaffProtectedRoute({ children }) {
  if (!isStaffAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function isPatientAuthenticated() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return false;
    const auth = JSON.parse(raw);
    return auth && auth.role === "patient";
  } catch (_) {
    return false;
  }
}

function PatientProtectedRoute({ children }) {
  if (!isPatientAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Staff routes */}
        <Route
          path="/staff/landing"
          element={
            <StaffProtectedRoute>
              <Stafflanding />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/manage-patient"
          element={
            <StaffProtectedRoute>
              <StaffManagePatient />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/staff-create-records"
          element={
            <StaffProtectedRoute>
              <StaffCreateRecords />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/manage-records"
          element={
            <StaffProtectedRoute>
              <StaffManageRecords />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/pregnancy-history"
          element={
            <StaffProtectedRoute>
              <StaffPregnancyHistory />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/newborn-information"
          element={
            <StaffProtectedRoute>
              <StaffNewbornInformation />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/delivery-record"
          element={
            <StaffProtectedRoute>
              <StaffDeliveryRecord />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/add-patient"
          element={
            <StaffProtectedRoute>
              <StaffAddPatient />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/manage-accounts"
          element={
            <StaffProtectedRoute>
              <StaffManageAccounts />
            </StaffProtectedRoute>
          }
        />

        {/* Patient routes */}
        <Route
          path="/user/landing"
          element={
            <PatientProtectedRoute>
              <UserLanding />
            </PatientProtectedRoute>
          }
        />


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
          path="/admin/manage-accounts/patient/edit"
          element={
            <ProtectedRoute>
              <Editpatientaccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-accounts/staff/edit"
          element={
            <ProtectedRoute>
              <Editstaffaccount />
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
          path="/admin/patient-records/edit/:id"
          element={
            <ProtectedRoute>
              <Editpatientinfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patient-records/view/:id" // Use the parameter to catch the patient_id
          element={
            <ProtectedRoute>
              <Addpatientinfo /> {/* Renders the component you requested */}
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
          path="/admin/patient-register/info"
          element={
            <ProtectedRoute>
              <AddpatientinfoModal />
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

        <Route
          path="/admin/pregnancy-history"
          element={
            <ProtectedRoute>
              <PregnancyHistory />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/delivery-record"
          element={
            <ProtectedRoute>
              <DeliveryRecord />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/newborn-information"
          element={
            <ProtectedRoute>
              <NewbornInformation />
            </ProtectedRoute>
          }
        />

        {/** Reports removed */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;