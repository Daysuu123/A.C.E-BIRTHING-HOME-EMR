
import React, { useState } from "react";
import "./PatientFeedbacks.css";

function PatientFeedbacks() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log("Feedback submitted:", feedback);
    setFeedback("");
  };

  return (
    <div className="pf-shell">
      <div className="page-header">
        <h1 className="page-title">Feedbacks</h1>
      </div>

      <div className="pf-body">
        <aside className="pf-sidebar">
          <div className="user-account">
            <div className="user-icon">👤</div>
            <div className="user-text">User Account</div>
          </div>
          
          <nav className="pf-nav">
            <a className="nav-btn" href="#">Account</a>
            <a className="nav-btn" href="#">Home</a>
            <a className="nav-btn" href="#">About</a>
            <a className="nav-btn active" href="#">Feedbacks</a>
          </nav>
        </aside>

        <main className="pf-content">
          <div className="gold-strip"></div>
          <div className="content-header">
            <div className="brand-icon">🍃</div>
            <div className="brand-name">A.C.E Birthing Home</div>
          </div>

          <div className="feedback-container">
            <h2 className="feedback-title">Give us your Feedback!</h2>
            
            <form className="feedback-form" onSubmit={handleSubmit}>
              <textarea
                className="feedback-textarea"
                placeholder="Feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="8"
              />
              
              <div className="form-actions">
                <button type="submit" className="send-btn">Send</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientFeedbacks;
