import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

function LoginPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'success' | 'error' | 'info'
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const devBypass = (email, password, reason) => {
    if (email === "admin@example.com" && password === "12345678") {
      localStorage.setItem("auth", JSON.stringify({ role: "admin", email }));
      navigate("/admin/dashboard", { replace: true });
      return true;
    }
    setMessageType("error");
    setMessage(reason || "Login failed.");
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
        devBypass(username, password, "Server returned a non-JSON response.");
        return;
      }

      if (result && (result.success || response.ok)) {
        setMessageType("success");
        setMessage(result.message || "Login successful!");
        // store simple auth flag for route guard
        localStorage.setItem("auth", JSON.stringify({ role: "admin", email: username }));
        // navigate to dashboard
        navigate("/admin/dashboard", { replace: true });
      } else {
        // If backend rejects, still allow dev bypass for demo creds
        if (!devBypass(username, password, (result && result.message) || "Login failed.")) {
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
          {message ? (
            <div className={`notice ${messageType}`}>
              {message}
            </div>
          ) : null}
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
            <button type="submit" className="submit" disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;