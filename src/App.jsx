import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginpage from "./Admin/loginpage";
import Admindashboard from "./Admin/Admindashboard";
import Checkuprecords from "./Admin/Checkuprecords";
import Createrecords from "./Admin/Createrecords";
import Manageaccs from "./Admin/Manageaccs";
import Patientrecords from "./Admin/Patientrecords";
import Patientregister from "./Admin/Patientregister";
import Staffregister from "./Admin/Staffregister";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/admin/dashboard" element={<Admindashboard />} />
        <Route path="/admin/checkup-records" element={<Checkuprecords />} />
        <Route path="/admin/create-records" element={<Createrecords />} />
        <Route path="/admin/manage-accounts" element={<Manageaccs />} />
        <Route path="/admin/patient-records" element={<Patientrecords />} />
        <Route path="/admin/patient-register" element={<Patientregister />} />
        <Route path="/admin/staff-register" element={<Staffregister />} />
      </Routes>
    </Router>
  );
}

export default App;