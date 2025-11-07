import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import logoImg from "../assets/ACElogo.png";
// backend handled via dev proxy at /api/loginpage.php

function LoginPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'success' | 'error' | 'info'
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const devBypass = (email, password, reason) => {
    // Test credentials for existing database data
    if (password === "Dace@09077041896" && email === "Dace") {
      localStorage.setItem("auth", JSON.stringify({ role: "admin", email, name: "Dace" }));
      navigate("/admin/dashboard", { replace: true });
      return true;
    }
    if (password === "hashed_docpass1" && email === "1") {
      localStorage.setItem("auth", JSON.stringify({ role: "staff", email, name: "Roberto Dela Cruz" }));
      navigate("/staff/landing", { replace: true });
      return true;
    }
    if (password === "hashed_password1" && email === "maria.santos@example.com") {
      localStorage.setItem("auth", JSON.stringify({ role: "patient", email, name: "Maria Santos" }));
      navigate("/user/landing", { replace: true });
      return true;
    }
    setMessageType("error");
    setMessage(reason || "Incorrect username or password.");
    return false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password })
      });

      let result;
      try {
        result = await response.json();
      } catch (_) {
        // Fallback: allow dev login without backend
        devBypass(username, password, "Incorrect username or password.");
        return;
      }

      if (result && (result.success || response.ok)) {
        setMessageType("success");
        setMessage(result.message || "Login successful!");
        
        // Use role from backend response
        const role = result.user?.role || 'admin';
        const userData = {
          role,
          email: result.user?.email || username,
          name: result.user?.name || username,
          id: result.user?.id
        };
        
        localStorage.setItem("auth", JSON.stringify(userData));
        
        // Navigate based on role
        if (role === "staff") {
          navigate("/staff/landing", { replace: true });
        } else if (role === "patient") {
          navigate("/user/landing", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      } else {
        // If backend rejects, still allow dev bypass for demo creds
        const serverMsg = (result && result.message) || (response.status === 401 ? "Incorrect username or password." : undefined);
        if (!devBypass(username, password, serverMsg || "Incorrect username or password.")) {
          // message already set by devBypass when it fails
        }
      }
    } catch (err) {
      // Network error: allow dev bypass
      devBypass(username, password, "Network error. Please check your connection or backend server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="brand-panel">
        <div className="brand-circle">
          <img src={logoImg} alt="A.C.E Birthing Home" className="brand-image" />
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
          {message ? (
            <div className={`notice ${messageType}`}>
              {message}
            </div>
          ) : null}
          <form className="login-form" onSubmit={handleLogin}>
            <label className="sr-only" htmlFor="username">Username</label>
            <input id="username" type="text" placeholder="Username" className="input" />

            <label className="sr-only" htmlFor="password">Password</label>
            <input id="password" type={showPassword ? "text" : "password"} placeholder="Password" className="input" />

            <div className="form-row">
              <label className="remember">
                <input 
                  type="checkbox" 
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                /> Show Password
              </label>
              <a href="/forgot-password" className="forgot">Forgot Password?</a>
            </div>
            <button type="submit" className="submit" disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
