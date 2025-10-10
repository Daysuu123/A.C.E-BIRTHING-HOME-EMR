import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginpage from "./Admin/loginpage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        
      </Routes>
    </Router>
  );
}

export default App;