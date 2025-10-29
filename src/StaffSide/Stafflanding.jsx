import React from "react";
import { useNavigate } from "react-router-dom";
import "../AdminSide/Admindashboard.css";
import StaffLayout from "../components/StaffLayout";

function StaffLanding() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/", { replace: true });
  };
  return (
    <StaffLayout title="Welcome">
      <div className="subtitle">Caring for mothers and newborns</div>

      <section className="chart-card" style={{display: 'grid', gap: 12}}>
        <blockquote style={{
          margin: 0,
          padding: '16px 18px',
          borderLeft: '4px solid #caa22a',
          background: '#fffef6',
          fontStyle: 'italic'
        }}>
          "Birth is not only about making babies. Birth is about making mothers — strong, competent, capable mothers who trust themselves and know their inner strength." — Barbara Katz Rothman
        </blockquote>

        <div style={{display:'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12}}>
          <div style={{background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:6, padding:16}}>
            Compassion, respect, and dignity for every mother.
          </div>
          <div style={{background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:6, padding:16}}>
            Safe beginnings for little ones, supported by your care.
          </div>
          <div style={{background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:6, padding:16}}>
            Together, we make families feel seen, heard, and held.
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:6, padding:16}}>
            "To be pregnant is to be vitally alive, thoroughly woman, and undoubtedly inhabited." — Anne Buchanan
          </div>
          <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:6, padding:16}}>
            "A baby is something you carry inside you for nine months, in your arms for three years, and in your heart till the day you die." — Mary Mason
          </div>
        </div>
      </section>
    </StaffLayout>
  );
}

export default StaffLanding;
