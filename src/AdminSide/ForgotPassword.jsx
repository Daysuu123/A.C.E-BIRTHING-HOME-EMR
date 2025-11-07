import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import logoImg from "../assets/ACElogo.png";
import { postJson } from "../lib/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [devCode, setDevCode] = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

  async function handleSendCode() {
    if (!isValidEmail(email)) {
      setMessageType("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setSending(true);
    setMessage("");
    try {
      const { data, ok } = await postJson("/auth/send-reset-code", { email: email.trim() });
      if (ok) {
        setMessageType("success");
        setMessage(data?.message || "Verification code sent to your email.");
      } else {
        // Dev fallback: emulate sending code
        const generated = "123456";
        setDevCode(generated);
        setMessageType("success");
        setMessage("Verification code sent (demo). Use 123456.");
      }
    } catch (_) {
      const generated = "123456";
      setDevCode(generated);
      setMessageType("success");
      setMessage("Verification code sent (demo). Use 123456.");
    } finally {
      setSending(false);
    }
  }

  async function handleConfirm() {
    if (!isValidEmail(email) || !String(code || "").trim()) {
      setMessageType("error");
      setMessage("Enter email and code.");
      return;
    }
    setVerifying(true);
    setMessage("");
    try {
      const { data, ok } = await postJson("/auth/confirm-reset-code", { email: email.trim(), code: code.trim() });
      if (ok || code.trim() === devCode) {
        setMessageType("success");
        setMessage(data?.message || "Code verified. Proceed to change password.");
        const token = data?.token || "demo-token";
        setTimeout(() => {
          navigate("/change-password", {
            replace: true,
            state: { email: email.trim(), resetToken: token },
          });
        }, 600);
      } else {
        setMessageType("error");
        setMessage(data?.message || "Invalid code. Please try again.");
      }
    } catch (_) {
      if (code.trim() === devCode && devCode) {
        setMessageType("success");
        setMessage("Code verified (demo). Proceed to change password.");
        setTimeout(() => {
          navigate("/change-password", {
            replace: true,
            state: { email: email.trim(), resetToken: "demo-token" },
          });
        }, 600);
      } else {
        setMessageType("error");
        setMessage("Network error. Please try again.");
      }
    } finally {
      setVerifying(false);
    }
  }

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
          <h2 className="login-title">Forget Password</h2>
          {message ? (
            <div className={`notice ${messageType}`}>{message}</div>
          ) : null}

          <div className="login-form">
            <label className="sr-only" htmlFor="fp-email">Email</label>
            <input
              id="fp-email"
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="field-action">
              <label className="sr-only" htmlFor="fp-code">Code</label>
              <div className="input-with-action">
                <input
                  id="fp-code"
                  type="text"
                  placeholder="Code"
                  className="input code-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <a
                  href="#"
                  className="forgot input-action"
                  onClick={(e) => { e.preventDefault(); if (!sending) handleSendCode(); }}
                  aria-disabled={sending}
                >
                  {sending ? "Sending..." : "Send"}
                </a>
              </div>
            </div>

            <button
              type="button"
              className="submit"
              onClick={handleConfirm}
              disabled={verifying}
            >
              {verifying ? "Confirming..." : "Confirm"}
            </button>

            <button
              type="button"
              className="link-back"
              onClick={() => navigate("/", { replace: true })}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;