import React from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Navigate to admin dashboard after successful login
    navigate('/admin/dashboard');
  };

  return (
    <div className="login-page">
      <div className="brand-panel">
        <div className="brand-circle">
          <div className="brand-logo">
            A.C.E
            <span className="brand-sub">Birthing Home</span>
          </div>
        </div>
        <p className="brand-mission">
          TO PROVIDE EXCEPTIONAL
          <br />
          MIDWIFERY CARE TO EACH AND
          <br />
          EVERY WOMAN
        </p>
      </div>

      <div className="form-panel">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <label className="sr-only" htmlFor="username">Username</label>
            <input id="username" type="text" placeholder="Username" className="input" />

            <label className="sr-only" htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Password" className="input" />

            <div className="form-row">
              <label className="remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot">Forgot Password?</a>
            </div>

            <button type="submit" className="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

