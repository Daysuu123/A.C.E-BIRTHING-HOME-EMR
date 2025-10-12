import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginpage from "./AdminSide/loginpage";
import Admindashboard from "./AdminSide/Admindashboard";
import Checkuprecords from "./AdminSide/Checkuprecords";
import Createrecords from "./AdminSide/Createrecords";
import Manageaccs from "./AdminSide/Manageaccs";
import Patientrecords from "./AdminSide/Patientrecords";
import Patientregister from "./AdminSide/Patientregister";


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